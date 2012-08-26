#pragma strict

var ures = 10;
var vres = 10;

var radius = 1.0;
var length = 5.0;

function Awake() {
	var mesh = Mesh();
	var vertices = new Vector3[ures * vres];
	var normals = new Vector3[ures * vres];
	var tangents = new Vector4[ures * vres];

	var index = 0;

	var x = -0.5 * length;
	for (var ui = 0; ui < ures; ui++) {
		var phi = Mathf.PI * 2.0 * ui / ures;
		var normal = Vector3(0.0, Mathf.Sin(phi), Mathf.Cos(phi));
		vertices[index] = normal * radius + Vector3(x, 0, 0);
		normals[index] = normal;
		tangents[index] = Vector4(1.0, 0.0, 0.0, 0.0);
		index++;
	}

	x = 0.0;
	for (var vi = 1; vi < vres; vi++) {
		x += length / (vres - 1);
		for (ui = 0; ui < ures; ui++) {
			vertices[index] = vertices[ui] + Vector3(x, 0.0, 0.0);
			normals[index] = normals[ui];
			tangents[index] = Vector4(1.0, 0.0, 0.0, 0.0);
			index++;
		}
	}

    mesh.vertices = vertices;
    mesh.normals = normals;
    mesh.tangents = tangents;
    mesh.RecalculateBounds();

	var indices = new int[(ures + 1) * vres + vres * (ures - 1)];
	var pointer = 0;
	index = 0;

	for (vi = 0; vi < vres; vi++) {
		for (ui = 0; ui < ures; ui++) {
			indices[index++] = pointer++;
		}
		indices[index++] = pointer - ures;
	}

	pointer += 1 - ures;
	var pointerAdd = -ures;

	for (ui = 1; ui < ures; ui++) {
		for (vi = 0; vi < vres; vi++) {
			indices[index++] = pointer;
			pointer += pointerAdd;
		}
		pointerAdd *= -1;
		pointer += 1 + pointerAdd;
	}

    mesh.SetIndices(indices, MeshTopology.LineStrip, 0);

    GetComponent.<MeshFilter>().mesh = mesh;	
}
