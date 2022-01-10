
/*

@author Kiwi
@date 2022-01-10

coding plan 🔧
    ☐ black background, white text
    ☐ write characters 'i' and 'm' on screen
    ☐ measure each one's width by checking pixels in order
    ☐ check measurements across various font sizes, including consolas
    ☐ now use charWidth to make textWidth. possible exception for gigamaru ' '
    ☐ convert to pGraphics object: off-screen buffer
    ☐ transfer to p5-dialogsystem
 */



function preload() {

}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
}

function draw() {
    background(234, 34, 24)
}