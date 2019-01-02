/**
 * This program rendered an orthographic view of a non-interactive scene.
 * The really purpose is to illustrate the use of the buffers and
 * functions that can help significantly with the "automated" construction
 * of synthetic images.
 *
 * David John
 * January 2016
 */

"use strict";
// global variables
var canvas;
var gl;
var pBuffer;  // position buffer
var cBuffer;  // color buffer
var crabBuffer;
var crabColorBuffer;
var indexBuffer;


var theta = 0.0;
var thetaLoc;



// set the max # of triangles and vertices -- not really wild about this approach
// but ok.  index keeps up with the number of vertices in the buffer.
var maxNumTriangles = 30000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

// color palette -- just simplifies some things
var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // 0: black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // 1: red
    vec4(1.0, 99.0/255, 71.0/255, 1.0), // 2: tomato
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // 3: yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // 4: green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // 5: blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // 6: magenta
    vec4(1,239.0/255,213.0/255,1.0), // 7: papaya whip
    vec4( 0.0, 1.0, 1.0, 1.0),   // 8: cyan
    vec4(0.0, 0.0, 0.0, 0.0),  //9: white
    vec4( 1.0, .3, .5, .7 ), // 10: pleasent pink
    vec4(277.0/255, 233.0/255, 139.0/255, 1.0) //11: sand
];

var numColors = 12;


// callback function that starts once html window is loaded
window.onload = function init() {

    // associate canvas with "gl-canvas"
    canvas = document.getElementById( "gl-canvas" );

    // setup WebGL presence in canvas, if that fails complain
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // set up orthgraphic view using the entire canvas, and
    // set the default color of the view as "gray"
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 184.0/255, 237.0/255, 240.0/255, 1.0 );

    //
    //  Compile and load vertex and fragment shaders
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Vertices have two attributes, position and color, which will
    // require two buffers
    //
    // set up pBuffer as a buffer where each entry is 8 bytes
    // (2X4 bytes, or 2 thirtytwo bit floats)
    pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);


    // associate JavaScript vPosition with vertex shader attribute "vPosition"
    // as a two dimensional vector where each component is a float
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);



    //
    // set up cBuffer as a buffer where each entry is 16 bytes
    // (4x4 bytes, of 4 thirtytwo bit colors)
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW);

    // associate JavaScript vColor with vertex shader attribute "vColor"
    // as a four dimensional vector (RGBA)
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

    var vIndex = gl.getAttribLocation( program, "vIndex");
    gl.vertexAttribPointer(vIndex, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vIndex);


    /*
    //__________________________________________________////
    //Crabs:
    crabBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, crabBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);


    // associate JavaScript vPosition with vertex shader attribute "vPosition"
    // as a two dimensional vector where each component is a float
    var crabPosition = gl.getAttribLocation(program, "crabPosition");
    gl.vertexAttribPointer(crabPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(crabPosition);



    //
    // set up cBuffer as a buffer where each entry is 16 bytes
    // (4x4 bytes, of 4 thirtytwo bit colors)
    crabColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, crabColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW);

    // associate JavaScript vColor with vertex shader attribute "vColor"
    // as a four dimensional vector (RGBA)
    var crabColor = gl.getAttribLocation( program, "crabColor");
    gl.vertexAttribPointer(crabColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(crabColor);
    */



    // put on the roof

    /*
    mytriangle(vec2(0.5,0.5), vec2(0.7,0.8), vec2(0.2,0.5), colors[1]);
    mytriangle(vec2(0.1,0.1), vec2(0.3,0.4), vec2(0.1,0.3), colors[0]);
    mytriangle(vec2(-0.4, 0,9), vec2(0.6, 0.7), vec2(0.1, 0.3), colors[7]);
    */

    //Really cute perspectives triangles... not fully what I was going for, but ok!
    /*
    mytriangle(vec2(0,0), vec2(0.0,0.4), vec2(0.25,0.3), colors[0]);
    mytriangle(vec2(0.0,0.0), vec2(0.0,0.4), vec2(-0.25,0.3), colors[1]);
    mytriangle(vec2(0.0, 0,0), vec2(0.0, -0.3), vec2(-0.5, -0.3), colors[2]);
     */

    /*
    mytriangle(vec2(0,0), vec2(0.0,0.4), vec2(0.25,0.3), colors[0]);
    mytriangle(vec2(0.0,0.0), vec2(0.0,0.4), vec2(-0.25,0.3), colors[1]);
    mytriangle(vec2(0.0, 0,0), vec2(-0.25, 0.3), vec2(-0.4, 0.0), colors[2]);
    mytriangle(vec2(0.0,0.0), vec2(-0.4, 0.0), vec2(-0.25, -0.3), colors[3]);
    */

    //Sand
    mytriangle(vec2(0,0), vec2(0.0, -1.0), vec2(-1.0,0.0), colors[11]);
    mytriangle(vec2(-1.0,-1.0), vec2(0.0, -1.0), vec2(-1.0,0.0), colors[11]);
    mytriangle(vec2(0.0,0.0), vec2(0.0, -1.0), vec2(1.0,0.0), colors[11]);
    mytriangle(vec2(1,-1), vec2(0.0, -1.0), vec2(1.0,0.0), colors[11]);

    //Wave
    //mytriangle(vec2(0,-0.1), vec2(0.2, 0.1), vec2(0.0,0.0), colors[5]);
    wave(100);

    //Crab
    mytriangle(vec2(-.4, -0.4), vec2(-0.5, -0.4), vec2(-0.45,-0.45), colors[1]);
    mytriangle(vec2(-.5, -0.4), vec2(-0.52, -0.42), vec2(-0.55,-0.47), colors[1]);
    mytriangle(vec2(-.4, -0.4), vec2(-0.38, -0.42), vec2(-0.35,-0.47), colors[1]);

    crab(0.7, -0.8, colors[1]);
    crab(0.3, -0.2, colors[1]);


    /*
    circle(vec2(0.0,0.0), .15, colors[6], 20);
    circle(vec2(0.15, -0.03), .1, colors[6], 20);
    circle(vec2(-0.15, -0.03), .1, colors[6], 20);
    */

    cloud(.4, .4, colors[9]);
    cloud(-.4, .8, colors[10]);

    circle(vec2(0.9, 0.9), .3, colors[3], 20);

    //circle(vec2(posX,posY), .15, color, 20);
    /*
    circle(vec2(-.5,-.5), .2, colors[0], 20);
    circle(vec2(-.5,-.5), .1, colors[11], 20);
    */

    //mytriangle(vec2(0.1,0.1), vec2(0.3,0.4), vec2(0.1,0.3), colors[0]);
    //mytriangle(vec2(-0.4, 0,9), vec2(0.6, 0.7), vec2(0.1, 0.3), colors[7]);


    alert("About to render -- "+ index + " vertexes");

    thetaLoc = gl.getUniformLocation( program, "theta" );

    // render away
    render();
}


// recursive function to render
function render() {

    // clear the working buffer
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );

    // render index vertices and colors from their buffers
    gl.drawArrays( gl.TRIANGLES, 0, index );

    // recursively call render() in the context of the browser
    window.requestAnimFrame(render);
}


// put a triangle into the position and color buffers
// Not sure I'm wild about this way of putting things in but ok for today
function mytriangle(aa, bb, cc, cccc)
{

    // focus on vBuffer (vertex buffer)
    gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten((aa)));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten((bb)));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten((cc)));


    // focus on cBuffer (color buffer)
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(cccc));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(cccc));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(cccc));



    // increase number of vertices
    index=index+3;

    // alert("mytriangle: after index: index="+index);

    return;

}

//BAD CODING__________________________________________________________//


/*
function crabtriangle(aa, bb, cc, cccc)
{

    // focus on vBuffer (vertex buffer)
    gl.bindBuffer( gl.ARRAY_BUFFER, crabBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten((aa)));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten((bb)));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten((cc)));


    // focus on cBuffer (color buffer)
    gl.bindBuffer( gl.ARRAY_BUFFER, crabColorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(cccc));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(cccc));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(cccc));



    // increase number of vertices
    index=index+3;

    // alert("mytriangle: after index: index="+index);

    return;

}
*/

function circle(base, radius, color, numTri)
{
    var i;
    //alert("circle");

    // using high school trigonometry, render the triangles
    for(i = 0; i< numTri; i++)
    {
        //alert("circle:  i= "+i);

        mytriangle(base,
            vec2(base[0]+radius*Math.cos(i*2.0*Math.PI/numTri), base[1]+radius*Math.sin(i*2.0*Math.PI/numTri)),
            vec2(base[0]+radius*Math.cos((i+1)*2.0*Math.PI/numTri), base[1]+radius*Math.sin((i+1)*2.0*Math.PI/numTri)),
            color);
    }

}

function cloud(posX, posY, color)
{
    circle(vec2(posX,posY), .15, color, 20);
    circle(vec2((posX + 0.15), (posY -0.03)), .1, color, 20);
    circle(vec2((posX-0.15), (posY-0.03)), .1, color, 20);
}

function wave(numTri)
{
    var i;
    var x;
    var posX = 0;
    var posX2 = 0.2;
    var negX = 0;
    var negX2 = .02;

    var num = 1 / numTri;

    x = num;
    for(i = 0; i< numTri; i += 2)
    {
        mytriangle(vec2(posX += x,-0.1), vec2(posX2 += x, 0.1), vec2(posX += x,0.0), colors[5]);
        mytriangle(vec2(negX -= x,-0.1), vec2(negX2 -= x, 0.1), vec2(negX -= x,0.0), colors[5]);

    }
}


function crab(posX, posY, color)
{
    mytriangle(vec2(0.0 + posX, 0.0 + posY), vec2(-0.1 + posX, 0.0 +posY), vec2(-0.05 + posX,-0.05 + posY), color);
    mytriangle(vec2(-.1 + posX, 0.0 + posY), vec2(-0.12 + posX, -0.02+ posY), vec2(-0.15 + posX,-0.07+posY), color);
    mytriangle(vec2(0.0 + posX, 0.0 + posY), vec2(0.02 + posX, -0.02 + posY), vec2(0.05 + posX,-0.07 + posY), color);
}
