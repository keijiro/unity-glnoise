#pragma strict

@Range(4, 256)		var sectionsU = 32;
@Range(4, 256)		var sectionsV = 64;
@Range(0.1, 10.0)	var radius = 1.0;
@Range(0.1, 10.0)	var length = 5.0;
@Range(0, 2)		var meshType = 0;

private var prevSectionsU = 0;
private var prevSectionsV = 0;
private var prevRadius = 0.0;
private var prevLength = 0.0;
private var prevMeshType = -1;

function Update() {
	if (CheckChanges()) BuildMesh();
}

private function CheckChanges() {
	var modified =
		sectionsU != prevSectionsU ||
		sectionsV != prevSectionsV ||
		prevRadius != radius ||
		prevLength != length ||
		prevMeshType != meshType;

	prevSectionsU = sectionsU;
	prevSectionsV = sectionsV;
	prevRadius = radius;
	prevLength = length;
	prevMeshType = meshType;

	return modified;
}

private function BuildMesh() {
	var mesh = Mesh();

	var normals = MakeNormals();
	mesh.vertices = MakeVertices(normals);
	mesh.normals = normals;
	mesh.tangents = MakeTangents();

    mesh.SetIndices(MakeIndexArray(), MeshTopology.LineStrip, 0);

    mesh.RecalculateBounds();

	var meshFilter = GetComponent.<MeshFilter>();
	if (meshFilter.mesh) Destroy(meshFilter.mesh);
    meshFilter.mesh = mesh;
}

private function MakeTangents() {
	var tangent = Vector4(1, 0, 0, 1);
	var tangents = new Vector4 [sectionsU * sectionsV];
	for (var i = 0; i < tangents.Length; i++) {
		tangents[i] = tangent;
	}
	return tangents;
}

private function MakeNormals() {
	var normals = new Vector3 [sectionsU * sectionsV];
	for (var u = 0; u < sectionsU; u++) {
		var phi = Mathf.PI * 2 * u / sectionsU;
		var normal = Vector3(0, Mathf.Sin(phi), Mathf.Cos(phi));
		for (var v = 0; v < sectionsV; v++) {
			normals[u + v * sectionsU] = normal;
		}
	}
	return normals;
}

private function MakeVertices(normals : Vector3[]) {
	var vertices = new Vector3 [sectionsU * sectionsV];
	var i = 0;
	for (var v = 0; v < sectionsV; v++) {
		var dx = Vector3.right * (length * v / (sectionsV - 1) - 0.5 * length);
		for (var u = 0; u < sectionsU; u++) {
			vertices[i++] = normals[u] * radius + dx;
		}
	}
	return vertices;
} 

private function MakeIndexArray() {
    if (meshType == 0) {
    	return MakeIndexArrayUStrip();
	} else if (meshType == 1) {
	    return MakeIndexArrayVStrip();
    } else {
	    return MakeIndexArrayDense();
    }
}

private function MakeIndexArrayUStrip() {
	var array = new int [sectionsU * sectionsV];
	for (var i = 0; i < array.Length; i++) {
		array[i] = i;
	}
	return array;
}

private function MakeIndexArrayVStrip() {
	var array = new int [sectionsU * sectionsV];
	var index = 0;
	var adder = sectionsU;
	var i = 0;

	for (var u = 0; u < sectionsU; u++) {
		for (var v = 0; v < sectionsV; v++) {
			array[i++] = index;
			index += adder;
		}
		adder *= -1;
		index += adder + 1;
	}
	return array;
}

private function MakeIndexArrayDense() {
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
