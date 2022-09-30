vec3 = glMatrix.vec3;
vec4 = glMatrix.mat4;
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/**
 * Extracts the elements of a mat4 object into an array
 * in row-major order
 * @param {glMatrix.mat4} M Input matrix
 * @returns list of elements in row-major order
 */
function getMat4Array(M) {
    let ret = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ret.push(M[j*4+i]);
        }
    }
    return ret;
}
    

function makeDinoScene() {
    let str = (`{
        "lights":[
            {
                "pos":[0, 200, 0],
                "color":[1, 1, 1]
            },
            {
                "pos":[-5, 2, -10],
                "color":[1, 1, 1]
            },
            {
                "pos":[5, 2, 10],
                "color":[1, 1, 1]
            }
        ],

        "cameras":[
            {}, {}, {}
        ],

        "name":"dinos",
        "materials":{
            "red":{
                "kd":[1.0, 0, 0.2]
            }
        },
        "children":[
            {
                "transform":[1, 0, 0, 0,
                             0, 0, 1, 0,
                             0, -1, 0, 0,
                             0, 0, 0, 1],
                "shapes":[
                    {
                        "type":"mesh",
                        "filename":"../meshes/dinopet.off"
                    }
                ]
            },`);
    let ending = (`
        ]
    }`);

    
    
    // TODO: Fill this in.  Add at least 20 dinos to the scene in a loop
    let r = 20;
    for (let index = 0; index < r; index++) {
        let appendThis = getDino(index);
        str = str + appendThis;
    }
    console.log(str);
    str = str + ending;
    let scene = JSON.parse(str);
    let s = JSON.stringify(scene, null, 4);
    document.getElementById("dinoCode").innerHTML = s;
    //download(s, "dinos.json", "text/javascript");
}

function getDino(num){
    let radians = 6.283/20;
    let theta = radians*num;
    let x = 15*Math.cos(theta);
    x = x.toFixed(2);
    let z = 15*Math.sin(theta);
    z = z.toFixed(2);
    let y = 0;
    theta = theta.toFixed(2);
    let locationVector = vec3.fromValues(x, y, z);
    let trans1 = vec4.create();
    let trans2 = vec4.create();
    let trans3 = vec4.create();
    vec4.fromTranslation(trans1, locationVector);
    vec4.fromXRotation(trans2, -1.5708);
    vec4.fromZRotation(trans3, -theta);
    let trans = vec4.create();
    vec4.mul(trans, trans1, trans2);
    vec4.mul(trans, trans, trans3);
    let ret = (`{
        "transform":[`+ getMat4Array(trans) + `],
        "shapes":[
            {
                "type":"mesh",
                "filename":"../meshes/dinopet.off"
            }
        ]
    },`);
    return ret;
}