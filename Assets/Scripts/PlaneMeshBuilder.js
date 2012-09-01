#pragma strict

@Range(2, 512)	var sectionsU = 32;
@Range(2, 512)	var sectionsV = 32;
@Range(0, 1)	var meshType = 0;

private var prevSectionsU = 0;
private var prevSectionsV = 0;
private var prevMeshType = -1;

function Update() {
	if (CheckChanges()) BuildMesh();
}

private function CheckChanges() {
	var modified =
		sectionsU != prevSectionsU ||
		sectionsV != prevSectionsV ||
		prevMeshType != meshType;

	prevSectionsU = sectionsU;
	prevSectionsV = sectionsV;
	prevMeshType = meshType;

	return modified;
}

private function BuildMesh() {
	var mesh = Mesh();
	mesh.vertices = MakeVertices();
	mesh.normals = MakeNormals();
	mesh.tangents = MakeTangents();
    mesh.SetIndices(MakeIndexArray(), MeshTopology.LineStrip, 0);
    mesh.RecalculateBounds();

	var meshFilter = GetComponent.<MeshFilter>();
	if (meshFilter.mesh) Destroy(meshFilter.mesh);
    meshFilter.mesh = mesh;
}

private function MakeNormals() {
	var normal = Vector3(0, 1, 0);
	var normals = new Vector3 [sectionsU * sectionsV];
	for (var i = 0; i < normals.Length; i++) {
		normals[i] = normal;
	}
	return normals;
}

private function MakeTangents() {
	var tangent = Vector4(0, 0, 1, 1);
	var tangents = new Vector4 [sectionsU * sectionsV];
	for (var i = 0; i < tangents.Length; i++) {
		tangents[i] = tangent;
	}
	return tangents;
}

private function MakeVertices() {
	var vertices = new Vector3 [sectionsU * sectionsV];
	var dx = 2.0 / (sectionsU - 1);
	var i = 0;
	for (var v = 0; v < sectionsV; v++) {
		var x = -1.0;
		var z = -1.0 + 2.0 * v / (sectionsV - 1);
		for (var u = 0; u < sectionsU; u++) {
			vertices[i++] = Vector3(x, 0, z);
			x += dx;
		}
	}
	return vertices;
} 

private function MakeIndexArray() {
	if (meshType == 0) {
		return MakeIndexArrayUStrip();
	} else {
		return MakeIndexArrayDense();
	}
}

private function MakeIndexArrayUStrip() {
	var array = new int [sectionsU * sectionsV];
	var index = 0;
	var direction = 1;
	var offs = 0;

	for (var v = 0; v < sectionsV; v++) {
		for (var u = 0; u < sectionsU; u++) {
			array[offs++] = index;
			index += direction;
		}
		index += (sectionsU - direction);
		direction *= -1;
	}
	return array;
}

private function MakeIndexArrayDense() {
	var array = new int [sectionsV * sectionsU + (sectionsV - 1) * (sectionsU * 2 - 2)];
	var index = 0;
	var offs = 0;

	for (var v = 0;; v++) {
		for (var u = 0; u < sectionsU; u++) {
			array[offs++] = index++;
		}

		if (v == sectionsV - 1) break;

		index--;
		array[offs++] = index + sectionsU;
		index--;

		for (u = 1; u < sectionsU - 1; u++) {
			array[offs++] = index;
			array[offs++] = index + sectionsU;
			index--;
		}

		array[offs++] = index;
		index += sectionsU;
	}

	return array;
}