/**
 * @author Kiwi
 * @date 2022-01-10
 *
 * coding plan 🔧
 * ☐ display black background, white text.
 * ☐ write 'i' and 'm' on screen to compare their widths
 *     ☐ check your chrome zoom settings. accurate results only at 100%
 * ☐ measure each character's width by checking pixels in order
 *     ☐ loadpixels in small canvas: 30x50 or so
 *     ☐ iterate through every canvas pixel from left to right
 *     ☐ keep track of the last non-black pixel you saw. that's the width!
 *         ☐ how do you determine "non-black"? there are 4 values per pixel
 * ☐ encapsulate functions
 *     ☐ one using .get to retrieve color 'object'
 *     ☐ the other using pixels[]
 * ☐ convert to pGraphics object: off-screen buffer with createGraphics
 * ☐ use charWidth to display single words
 * ☐ now use charWidth to make textWidth. exception for gigamaru space char
 * ☐ transfer into p5-dialogsystem!
 *
 */

let font
let debug

/**
 * this can't be large because our charWidth graphics buffer is of finite
 * size! note that we must also take into account our webpage scaling in
 * chrome; I have it set at 125%, a significant bump up from default.
 * @type {number}
 */
const FONT_SIZE = 18
const LETTER_SPACING = 1.25
const SPACE_WIDTH = FONT_SIZE / 2

function preload() {
    font = loadFont('data/giga.ttf')
    // font = loadFont("data/meiryo.ttf")

}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, FONT_SIZE)

    fill(0, 0, 100)
    noStroke()

    background(234, 34, 24)

// TODO use charWidth to display characters first
    let cursor = new p5.Vector(0, 100)
    let input = "I couldn't even get one pixel working because my generatePixel function didn't work. I need four nested loops to be able to complete my task because I don't know how to do this otherwise. It seems like I'm loading just fine."
    let smallInput = "Corsair K100. I'm late to make Aerry lunch!"

    let charWidth = 0
    for (let c of input) {
        if (c === ' ') {
            cursor.x += SPACE_WIDTH
        } else {
            charWidth = charWidth_pixels(c)

            if (cursor.x + charWidth > width) {
                cursor.y += FONT_SIZE * 1.5
                cursor.x = 0
            }

            text(c, cursor.x, cursor.y)

            fill(0, 0, 100, 50)
            circle(cursor.x, cursor.y + 4, 2)

            fill(0, 0, 100, 100)
            cursor.x += charWidth + LETTER_SPACING
            line(cursor.x, 0, cursor.x, height)
        }
    }

    console.log(wordWidth(input))
    console.log(charWidth_pixels('m'))
    console.log(charWidth_pixels('i'))
}


function draw() {
}


/**
 *
 * TODO Use charWidth to make textWidth. no spaces at first
 */
function wordWidth(word) {
    let sum = 0

    console.log([...word]);

    [...word].forEach(w => {
        if (w === ' ')
            sum += SPACE_WIDTH
        else
            sum += charWidth_pixels(w) + LETTER_SPACING
    })

    return sum
}


/*  return the width in pixels of char using the pixels array
 */
function charWidth_pixels(char) {
    /**
     * create a graphics buffer to display a character. then determine its
     * width by iterating through every pixel. Noting that 'm' in size 18
     * font is only 14 pixels, perhaps setting the buffer to a max width of
     * FONT_SIZE is sufficient. The height needs to be a bit higher to
     * account for textDescent, textAscent. x2 is inexact, but should be plenty.
     * @type {p5.Graphics}
     */
    let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)

    g.background(0, 0, 0)
    g.fill(0, 0, 100)

    /**
     *  the base height of g is g.height; this is an approximation of what
     *  would fit most characters. utterly untested but seems okay with
     *  large paragraphs. A lowercase 'm' is about ⅓ the height of
     *  textAscent + textDescent.; a 'j' is ⅔.
     */
    g.text(char, 0, g.height - FONT_SIZE / 2)

    g.loadPixels()

    // 🔧 we can't use pixels[]. it's g.pixels after g.loadPixels!!
    let pd = g.pixelDensity()

    let offset
    let max_x = 0

    let redFail, greenFail, blueFail, alphaFail
    /*  a pixel value "fails" if it's not [0, 0, 0, 255] which indicates
     black. so if redFail is true, that means red is not 0. if alphaFail
     is true, it means alpha is not 255.
     */

    /* iterate through every pixel in pixels[] array */
    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            offset = (y * g.width + x) * pd * 4

            // pixel values are rgba in the format [r, g, b, a]
            redFail = (offset % 4 === 0 && g.pixels[offset] !== 0)
            greenFail = (offset % 4 === 1 && g.pixels[offset] !== 0)
            blueFail = (offset % 4 === 2 && g.pixels[offset] !== 0)
            alphaFail = (offset % 4 === 3 && g.pixels[offset] !== 255)

            if (redFail || greenFail || blueFail || alphaFail) {
                max_x = Math.max(x, max_x)
            }
        }
    }

    // image(g, width/2, height/2)
    return max_x
}


/*
 return the width in pixels of char using get. this should be significantly
 slower than using pixels[].
 */
function charWidth_get(char) {
    let g = createGraphics(30, 50)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)

    g.background(0, 0, 0)
    g.fill(0, 0, 100)
    g.text(char, 0, 33)

    // still important despite using .get
    g.loadPixels()

    let max_x = 0

    /*  use the .get() equivalent for pixels[] found at
     *  https://p5js.org/reference/#/p5/get to find the text width
     */
    let c // color of pixel as a p5.color (represented as an 32-bit int!)
    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            c = g.get(x, y)
            if (!(c[0] === 0 && c[1] === 0 && c[2] === 0 && c[3] === 255)) {
                max_x = Math.max(x, max_x)
            }
        }
    }

    image(g, width / 2, height / 2)
    return max_x
}


function getPixel(x, y, pixelDensity) {
    loadPixels()
    let off = (y * width + x) * pixelDensity * 4;
    let components = [
        pixels[off],
        pixels[off + 1],
        pixels[off + 2],
        pixels[off + 3]
    ]
}

function mousePressed() {
    console.log(debug)
}


function archive() {
    let max_x = 0 // the furthest right this character displays on screen
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // every pixel is represented as 4 values in pixels[]: rgba
            let p = 4 * (x + y * width)

            if (pixels[p] > 0) {
                debug = max_x
                max_x = Math.max(x, max_x)
            }
        }
    }
}