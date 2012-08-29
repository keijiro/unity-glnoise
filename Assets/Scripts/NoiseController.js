#pragma strict

var base = Vector3(0, 10, 20);
var speed = Vector3(0, 0, 0.1);

private var position = Vector3.zero;

function Update() {
	position += speed * Time.deltaTime;
	renderer.material.SetVector("offs_u", position + Vector3.forward * base[0]);
	renderer.material.SetVector("offs_v", position + Vector3.forward * base[1]);
	renderer.material.SetVector("offs_w", position + Vector3.forward * base[2]);

	renderer.material.SetVector("amp", Vector4(1, 1, 1, 0));
	renderer.material.SetVector("freq", Vector4(1, 1, 1, 0));
}
