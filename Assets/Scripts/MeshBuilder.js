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

	var tangent = Vector4(1.0, 0.0, 0.0, 1.0);

	var i = 0;
	var x = -0.5 * length;
	for (var u = 0; u < ures; u++) {
		var phi = Mathf.PI * 2.0 * u / ures;
		var normal = Vector3(0.0, Mathf.Sin(phi), Mathf.Cos(phi));
		vertices[i] = normal * radius + Vector3(x, 0, 0);
		normals[i] = normal;
		tangents[i] = tangent;
		i++;
	}

	x = 0.0;
	for (var v = 1; v < vres; v++) {
		x += length / (vres - 1);
		for (u = 0; u < ures; u++) {
			vertices[i] = vertices[u] + Vector3(x, 0.0, 0.0);
			normals[i] = normals[u];
			tangents[i] = tangent;
			i++;
		}
	}

    mesh.vertices = vertices;
    mesh.normals = normals;
    mesh.tangents = tangents;
    mesh.RecalculateBounds();

	var indices = new int[(ures + 1) * vres + (vres - 1) * (2 * ures + 1)];
	var pointer = 0;
	i = 0;

	for (v = 0; v < vres; v++) {
		for (u = 0; u < ures; u++) {
			indices[i++] = pointer++;
		}
		indices[i++] = pointer - ures;
	}

	pointer -= ures;

	for (v = 0; v < vres - 1; v++) {
		for (u = 0; u < ures; u++) {
			indices[i++] = pointer;
			indices[i++] = pointer - ures;
			pointer++;
		}
		indices[i++] = pointer - ures;
		pointer -= ures * 2;
	}

    mesh.SetIndices(indices, MeshTopology.LineStrip, 0);

    GetComponent.<MeshFilter>().mesh = mesh;	
}
