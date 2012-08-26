Shader "Custom/Perlin Unlit" {
   Properties {
      _MainTex ("Texture Image", 2D) = "white" {} 
   }
   SubShader {
      Pass {    
         GLSLPROGRAM
 
         uniform sampler2D _MainTex;
         uniform vec4 _Time;
         varying vec4 textureCoordinates; 

         #ifdef VERTEX

         attribute vec4 Tangent;

         #include "classicnoise3D.glslinc"

         float fbm(vec3 coord) {
            return
               cnoise(coord      ) * 0.5 +
               cnoise(coord * 2.0) * 0.25 +
               cnoise(coord * 4.0) * 0.125 +
               cnoise(coord * 8.0) * 0.0625;
         }

         vec4 modify_vertex(vec4 src) {
            float amp = 0.6;
         	vec3 crd = src.xyz * 1.0;
         	
            vec3 offs_u = vec3(0.0, 0.0, _Time.x);
            vec3 offs_v = vec3(0.0, 0.0, _Time.x + 10.0);
            vec3 offs_w = vec3(0.0, 0.0, _Time.x + 20.0);

         	vec3 binormal = cross(gl_Normal, Tangent.xyz) * Tangent.w;

            vec3 disp = 
         		Tangent.xyz * fbm(crd + offs_u) * amp +
         		binormal    * fbm(crd + offs_v) * amp +
         		gl_Normal   * fbm(crd + offs_w) * amp;
            src.xyz = src.xyz + disp;
         	
            return src;
         }
 
         void main() {
            textureCoordinates = gl_MultiTexCoord0;
            gl_Position = gl_ModelViewProjectionMatrix * modify_vertex(gl_Vertex);
         }
 
         #endif
 
         #ifdef FRAGMENT
 
         void main() {
            gl_FragColor = texture2D(_MainTex, vec2(textureCoordinates));
         }
 
         #endif
 
         ENDGLSL
      }
   }
}