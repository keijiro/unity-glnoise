#pragma strict

@Range(4, 256)
var sectionsU = 32;

@Range(4, 256)
var sectionsV = 64;

@Range(0.1, 10.0)
var radius = 1.0;

@Range(0.1, 10.0)
var length = 5.0;

@Range(0, 1)
var meshType = 0;

var rebuild = false;

function Awake() {
	BuildMesh();
}

function Update() {
	if (rebuild) {
		BuildMesh();
		rebuild = false;
	}
}

function BuildMesh() {
	var meshFilter = GetComponent.<MeshFilter>();
	var mesh = meshFilter.mesh ? meshFilter.mesh : Mesh();

	MakeVertexArray(mesh);

    if (meshType == 0) {
	    mesh.SetIndices(MakeIndexArraySimple(), MeshTopology.LineStrip, 0);
    } else {
	    mesh.SetIndices(MakeIndexArrayDense(), MeshTopology.LineStrip, 0);
    }

    meshFilter.mesh = mesh;
}

function MakeVertexArray(mesh : Mesh) {
	var vertices = new Vector3 [sectionsU * sectionsV];
	var normals = new Vector3 [sectionsU * sectionsV];
	var tangents = new Vector4 [sectionsU * sectionsV];

	var i = 0;
	var dx = Vector3(-0.5 * length, 0, 0);
	for (var u = 0; u < sectionsU; u++) {
		var phi = Mathf.PI * 2 * u / sectionsU;
		var normal = Vector3(0, Mathf.Sin(phi), Mathf.Cos(phi));
		vertices[i] = normal * radius + dx;
		normals[i] = normal;
		i++;
	}

	dx = Vector3.zero;
	for (var v = 1; v < sectionsV; v++) {
		dx += Vector3(length / (sectionsV - 1), 0, 0);
		for (u = 0; u < sectionsU; u++) {
			vertices[i] = vertices[u] + dx;
			normals[i] = normals[u];
			i++;
		}
	}

	var tangent = Vector4(1, 0, 0, 1);
	for (i = 0; i < tangents.Length; i++) {
		tangents[i] = tangent;
	}

    mesh.vertices = vertices;
    mesh.normals = normals;
    mesh.tangents = tangents;
    mesh.RecalculateBounds();
}

function MakeIndexArraySimple() {
	var array = new int [sectionsU * sectionsV];
	for (var i = 0; i < array.Length; i++) {
		array[i] = i;
	}
	return array;
}

function MakeIndexArrayDense() {
	var array = new int [(sectionsU + 1) * sectionsV + (sectionsV - 1) * (2 * sectionsU - 1)];
	var index = 0;
	var i = 0;

	for (var v = 0; v < sectionsV; v++) {
		for (var u = 0; u < sectionsU; u++) {
			array[i++] = index++;
		}
		array[i++] = index - sectionsU;
	}

	index -= sectionsU;

	for (v = 0; v < sectionsV - 1; v++) {
		for (u = 0; u < sectionsU - 1; u++) {
			array[i++] = index - sectionsU + 1;
			array[i++] = index + 1;
			index++;
		}
		index += 1 - sectionsU * 2;
		array[i++] = index;
	}

	return array;
}
