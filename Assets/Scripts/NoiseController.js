#pragma strict

var base = Vector3(0, 10, 20);
var speed = Vector3(0, 0, 0.1);

private var position = Vector3.zero;

function Update() {
	position += speed * Time.deltaTime;
	renderer.material.SetVector("_OffsU", position + Vector3.forward * base[0]);
	renderer.material.SetVector("_OffsV", position + Vector3.forward * base[1]);
	renderer.material.SetVector("_OffsW", position + Vector3.forward * base[2]);
}
