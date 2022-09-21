//Purpose: The engine behind the 3D primitive operations for Mini Assignment 1

vec3 = glMatrix.vec3;

//////////////////////////////////////////////
///********         PART 1          *******///
//////////////////////////////////////////////


/**
 * Compute the angle between the vectors ab and ac
 * @param {vec3} a First point
 * @param {vec3} b Second point
 * @param {vec3} c Third point
 * 
 * @return {float} Angle between vectors ab and ac in degrees
 */
function getAngle(a, b, c) {
    // TODO: Fill this in
	let ac = vec3.create();
	let ab = vec3.create();
	
	vec3.subtract(ac, c, a);
	vec3.subtract(ab, b, a);
	if(vec3.length(ac)==0 || vec3.length(ab)==0){
		return -1;
	}
	let dotProd = (ac[0]*ab[0])+(ac[1]*ab[1])+(ac[2]*ab[2]);
	let aclength = Math.sqrt((ac[0]*ac[0])+(ac[1]*ac[1])+(ac[2]*ac[2]));
	let bclength = Math.sqrt((ab[0]*ab[0])+(ab[1]*ab[1])+(ab[2]*ab[2]));
	if(aclength == 0 || bclength == 0){
		return 0;
	}
	let cos = dotProd/(aclength*bclength);
	let result = Math.acos(cos);
	result = 180*result/Math.PI;
	return result;
}



/**
 * Project vector u onto vector v using the glMatrix library
 * @param {vec3} u Vector that's being projected
 * @param {vec3} v Vector onto which u is projected
 * 
 * @return {vec3} The projection of u onto v
 */
function projVector(u, v) {
    // TODO: Fill this in
	if(vec3.length(u)==0 || vec3.length(v)==0){
		return vec3.create();
	}
	let uvdot = vec3.dot(u, v);
	let vdot = vec3.dot(v, v);
	
	let divRes = uvdot/vdot;
	let result1 = (divRes)*v[0];
	let result2 = (divRes)*v[1];
	let result3 = (divRes)*v[2];
	let result = [result1, result2, result3];
	return result;
}


/**
 * 
 * @param {vec3} u Vector that's being projected
 * @param {vec3} v Vector onto which u is perpendicularly projected
 * 
 * @return {vec3} The perpendicular projection of u onto v
 */
function projPerpVector(u, v) {
    // TODO: Fill this in
	if(vec3.length(u)==0 || vec3.length(v)==0){
		return vec3.create();
	}
	let result = vec3.create();
	vec3.subtract(result, u, projVector(u, v));
	return result;
}


/**
 * Given three 3D vertices a, b, and c, compute the area 
 * of the triangle they span
 * @param {vec3} a First point
 * @param {vec3} b Second point
 * @param {vec3} c Third point
 * 
 * @return {float} Area of the triangle
 */
function getTriangleArea(a, b, c) {
    // TODO: Fill this in
	let ac = vec3.create();
	let ab = vec3.create();
	vec3.subtract(ac, c, a);
	vec3.subtract(ab, b, a);
	let cross = vec3.create();
	vec3.cross(cross, ac, ab);
	let length = vec3.length(cross);
	let result = 0.5*(length);
	console.log(result);
	return (result);
}


/**
 * For a plane determined by the points a, b, and c, with the plane
 * normal determined by those points in counter-clockwise order using 
 * the right hand rule, decide whether the point d is above, below, or on the plane
 * @param {vec3} a First point on plane
 * @param {vec3} b Second point on plane
 * @param {vec3} c Third point on plane
 * @param {vec} d Test point
 * 
 * @return {int} 1 if d is above, -1 if d is below, 0 if d is on
 */
function getAboveOrBelow(a, b, c, d) {
	let ac = vec3.create();
	let ab = vec3.create();
	let ad = vec3.create();

	vec3.subtract(ac, c, a);
	vec3.subtract(ab, b, a);
	vec3.subtract(ad, d, a);
	if((vec3.angle(ac, ab) == 180 || vec3.angle(ac, ab) == 0)){
		return -2;
	}
	let normal = vec3.create();
	vec3.cross(normal, ab, ac);
	let dot = vec3.dot(normal, ad);
	if(dot == 0){
		return 0;
	}
	else{
		return (dot)/Math.abs(dot);
	}
}







//////////////////////////////////////////////
///********         PART 2          *******///
//////////////////////////////////////////////




/**
 * Compute the barycentric coordinates of a point p with respect to a triangle /\abc
 * 
 * @param {vec3} a Point a on the triangle
 * @param {vec3} b Point b on the triangle
 * @param {vec3} c Point c on the triangle
 * @param {vec3} p The point whose barycentric coordinates we seek
 * 
 * @return {vec3} An vec3 with the barycentric coordinates (alpha, beta, gamma)
 * 				  corresponding to a, b, and c, respectively, so that
 * 				  alpha + beta + gamma = 1, and alpha, beta, gamma >= 0
 *          CORNER CASES:
 * 				  (1) If p is not inside of /\abc, then return [0, 0, 0]
 *          (2) If /\abc is zero area, then return [1, 0, 0] iff p = a (=b=c)
 *              otherwise, return [0, 0, 0]
 */
function getBarycentricCoords(a, b, c, p) {
	// TODO: Fill this in
	//Check if their all on the same plane
	
	if(vec3.equals(a, b) && vec3.equals(b, c) && vec3.equals(c, p)){
		return vec3.fromValues(1, 0, 0);
	}
	if(vec3.equals(a, b) && vec3.equals(b, c) && !vec3.equals(c, p)){
		return vec3.create();
	}
	let abc = getTriangleArea(a, b, c);
	let alpha = getTriangleArea(b, c, p)/abc;
	let beta = getTriangleArea(a, c, p)/abc;
	let gamma = getTriangleArea(a, b, p)/abc;
	let sum = alpha+beta+gamma;
	if(sum > 0.9999 && sum < 1.0001){
		return vec3.fromValues(alpha, beta, gamma);
	}
	return vec3.create();  //This is a dummy value!  Replace with your answer
}


/**
 * Find the intersection of a ray with a triangle
 * 
 * @param {vec3} p0 Endpoint of ray 
 * @param {vec3} v Direction of ray
 * @param {vec3} a Triangle vertex 1
 * @param {vec3} b Triangle vertex 2
 * @param {vec3} c Triangle vertex 3
 * 
 * @return {list} A list of vec3 objects.  The list should be empty
 *          if there is no intersection, or it should contain 
 *          exactly one vec3 object if there is an intersection
 *          CORNER CASES:
 *          (1) If the ray is parallel to the plane, 
 *               return an empty list
 */
function rayIntersectTriangle(p0, v, a, b, c) {
	// TODO: Fill this in
	let ba = vec3.create();
	vec3.subtract(ba, b, a);
	let ca = vec3.create();
	vec3.subtract(ca, c, a);
	let bcCross = vec3.create(); vec3.cross(bcCross, ba, ca);
	let normal = vec3.create();
	vec3.normalize(normal, bcCross);
	let dotProd = vec3.dot(v, normal);
	if(dotProd == 0){
		return [];
	}
	let pa = vec3.create(); vec3.subtract(pa, a, p0);
	let apDotN = vec3.dot(pa, normal);
	let t = apDotN/dotProd;
	if(t<0){
		return [];
	}
	let point = vec3.create(); vec3.scaleAndAdd(point, p0, v, t);
	if(!vec3.equals(getBarycentricCoords(a, b, c, point), vec3.create())){
		return [point];
	}
	return []; //This is a dummy value!  Replace with your answer
}


/**
 * Find the intersection of the ray p0 + tv, t >= 0, with the
 * sphere centered at c with radius r.
 * 
 * @param {vec3} p0 Endpoint of the ray
 * @param {vec3} v Direction of the ray
 * @param {vec3} center Center of the sphere
 * @param {number} r Radius of the sphere
 * 
 * @return {list of vec3} A list of intersection points, 
 *   ***in the order in which the ray hits them***
 * If the ray doesn't hit any points, this list should be empty.
 * Note that a ray can hit at most 2 points on a sphere.
 */
function rayIntersectSphere(p0, v, center, r) {
	// TODO: Fill this in
	let a = vec3.dot(v, v);
	let scaledV = vec3.create();
	vec3.scale(scaledV, v, 2);
	let p0subc = vec3.create(); vec3.subtract(p0subc, p0, center);
	let b = vec3.dot(scaledV, p0subc);
	let c = vec3.dot(p0subc, p0subc);
	c = c-(r*r);
	if(a == 0){
		return [];
	}
	let root = (b*b)-(4*a*c);
	if(root < 0){
		return [];
	}
	let sqrt = Math.sqrt(root);
	let topPos = -b + sqrt;
	let topNeg = -b - sqrt;
	let tpos = topPos/(2*a);
	let tneg = topNeg/(2*a);
	if(tpos<0 && tneg<0){
		return [];
	}
	else if(tpos<0 && tneg>0){
		let ret = vec3.create(); vec3.scaleAndAdd(ret, p0, v, tneg);
		return [ret];
	}
	else if(tneg<0 && tpos>0 || root==0){
		let ret = vec3.create(); vec3.scaleAndAdd(ret, p0, v, tpos);
		return [ret];
	}
	else{
		let p1 = vec3.create(); vec3.scaleAndAdd(p1, p0, v, tneg);
		let p2 = vec3.create(); vec3.scaleAndAdd(p2, p0, v, tpos);
		if(tpos>tneg){
			return [p1, p2];
		}
		else{
			return [p2, p1];
		}
	}
	return []; //This is a dummy value!  Replace with your answer
}
