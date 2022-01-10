
/*

@author Kiwi
@date 2022-01-10

coding plan 🔧
    ☒ black background, white text
    ☒ write characters 'i' and 'm' on screen
    ☐ make things work with get()
    ☐ measure each one's width by checking pixels in order
    ☐ check measurements across various font sizes, including consolas
    ☐ now use charWidth to make textWidth. possible exception for gigamaru ' '
    ☐ convert to pGraphics object: off-screen buffer
    ☐ transfer to p5-dialogsystem
 */

let font
let debug

function preload() {
    // font = loadFont('data/giga.ttf')
    font = loadFont("data/giga.ttf")

}

function setup() {
    createCanvas(25, 40)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 30)

    // FIXME neither textAscent nor textDescent work for gigamarujr.ttf

    background(0, 0, 0)
    fill(0, 0, 100)
    text('5', 0, 30)

    loadPixels()
    let pd = pixelDensity()
    let offset
    let max_x = 0

    /*  use the .get() equivalent for pixels[] found at
     *  https://p5js.org/reference/#/p5/get to find the text width
     */
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            offset = (y * width + x) * pd * 4

            if (pixels[offset] !== 0) {
                max_x = Math.max(x, max_x)
            }
        }
    }

    print(max_x)
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

function draw() {

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
            let p = 4 * (x + y*width)

            if(pixels[p] > 0) {
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
    img.text('i', 0, img.height/2)
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
    image(img, width/2, height/2)
}