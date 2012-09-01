#pragma strict

private var target : GameObject;

function Start() {
	target = new GameObject(gameObject.name + " target");
	target.transform.parent = transform.parent;
	target.transform.localPosition = transform.localPosition;
	target.transform.localRotation = transform.localRotation;
}

function Update() {
	transform.localPosition = ExpEase.Out(transform.localPosition, target.transform.localPosition, -1.5);
	transform.localRotation = ExpEase.Out(transform.localRotation, target.transform.localRotation, -1.5);
}
