//

/*
 @author Kiwi
 @date 2022-01-10

 coding plan 🔧
 ☒ black background, white text
 ☒ write characters 'i' and 'm' on screen
 ☒ make things work with get()
 ☒ measure each one's width by checking pixels in order
    ☐ check measurements across various font sizes, including consolas
 ☒ encapsulate functions: one using .get, one using pixels
 ☐ use charWidth to display words
 ☐ now use charWidth to make textWidth. possible exception for gigamaru ' '
 ☐ convert to pGraphics object: off-screen buffer
 ☐ transfer to p5-dialogsystem
 */

let font
let debug

function preload() {
    font = loadFont('data/giga.ttf')
    // font = loadFont("data/meiryo.ttf")

}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 18)

    background(234, 34, 24)
    fill(0, 0, 100)
    noStroke()


// TODO use charWidth to display characters first
    let cursor = new p5.Vector(0, 100)
    let input = "I couldn't even get one pixel working because my generatePixel function didn't work. I need four nested loops to be able to complete my task because I don't know how to do this otherwise. It seems like I'm loading just fine."

    let charWidth = 0
    for (let c of input) {
        if (c === ' ') {
            cursor.x += 10
        } else {
            charWidth = charWidth_pixels(c)

            if (cursor.x + charWidth > width) {
                cursor.y += 30
                cursor.x = 0
            }

            text(c, cursor.x, cursor.y)
            circle(cursor.x, cursor.y+4, 2)

            cursor.x += charWidth+2
            line(cursor.x, 0, cursor.x, height)

            // print(c)
            print(charWidth)
            // print(cursor.x)
        }
    }

    // print(charWidth_pixels('o'))
    // print(charWidth_pixels('m'))
    // print(charWidth_pixels('g'))
}


function draw() {
}


/*

TODO Use charWidth to make textWidth


 */


/*  return the width in pixels of char using the pixels array
 */
function charWidth_pixels(char) {
    let g = createGraphics(14, 100)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, 18)

    g.background(0, 0, 0)
    g.fill(0, 0, 100)
    g.text(char, 0, 15)

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
    g.textFont(font, 30)

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

function debugLog(text) {
    if (frameCount % 60 == 0)
        console.log(text)
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

function createGraphicsArchive() {
    let img = createGraphics(300, 300) // arbitrary sizes big enough for a char
    // img.background(0, 0, 0)
    img.fill(0, 0, 100)
    img.text('i', 0, img.height / 2)
    img.loadPixels()

    let c // a color of a single pixel in our image

    for (let i = 0; i < img.width; i++)
        for (let j = 0; j < img.height; j++) {
            // get the color of pixel at i.j
            c = img.get(i, j)

            // set the appropriate nxn section of our result to the color of
            // that single pixel
            /*
             for (let m=i*factor; m<i*factor+factor; m++)
             for (let n=j*factor; n<j*factor+factor; n++)
             result.set(m, n, c)

             */
        }
    image(img, width / 2, height / 2)
}