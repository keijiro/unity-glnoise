#pragma strict

@script ExecuteInEditMode
@script RequireComponent(Camera)

var intensity = 0.375;
var blur = 0.1;
var blurSpread = 1.5;

var vignetteMaterial : Material;
var separableBlurMaterial : Material;	

function OnRenderImage(source : RenderTexture, destination : RenderTexture) {	
	var widthOverHeight = (1.0 * source.width) / source.height;
	var oneOverBaseSize = 1.0 / 512;

	var halfRezColor = RenderTexture.GetTemporary(source.width / 2, source.height / 2, 0);
	var quarterRezColor = RenderTexture.GetTemporary(source.width / 4, source.height / 4, 0);
	var secondQuarterRezColor = RenderTexture.GetTemporary(source.width / 4, source.height / 4, 0);

	Graphics.Blit(source, halfRezColor);
	Graphics.Blit(halfRezColor, quarterRezColor);

	separableBlurMaterial.SetVector("offsets", Vector4(0.0, blurSpread * oneOverBaseSize, 0.0, 0.0));
	Graphics.Blit(quarterRezColor, secondQuarterRezColor, separableBlurMaterial);
	separableBlurMaterial.SetVector("offsets", Vector4(blurSpread * oneOverBaseSize / widthOverHeight, 0.0, 0.0, 0.0));
	Graphics.Blit(secondQuarterRezColor, quarterRezColor, separableBlurMaterial);

	vignetteMaterial.SetFloat("intensity", intensity);
	vignetteMaterial.SetFloat("blur", blur);
	vignetteMaterial.SetTexture("vignetteTex", quarterRezColor);
	Graphics.Blit(source, destination, vignetteMaterial);
	
	RenderTexture.ReleaseTemporary(halfRezColor);			
	RenderTexture.ReleaseTemporary(quarterRezColor);	
	RenderTexture.ReleaseTemporary(secondQuarterRezColor);	
}
