Shader "Custom/Perlin Unlit" {
   Properties {
      _Color ("Color", Color) = (1, 1, 1, 1)
      _Freq ("Frequency", Vector) = (1, 1, 1, 0)
      _Amp ("Amplifier", Vector) = (1, 1, 1, 0)
      _OffsU ("Offset U", Vector) = (0, 0, 0, 0)
      _OffsV ("Offset V", Vector) = (0, 0, 10, 0)
      _OffsW ("Offset W", Vector) = (0, 0, 20, 0)
   }
   SubShader {
      Tags {"Queue" = "Transparent"}
      Pass {    
         Cull Off
         ZWrite Off
         Blend SrcAlpha OneMinusSrcAlpha

         GLSLPROGRAM
 
         uniform vec4 _Color;
         uniform vec3 _Freq;
         uniform vec3 _OffsU;
         uniform vec3 _OffsV;
         uniform vec3 _OffsW;
         uniform vec3 _Amp;

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
         	vec3 crd = src.xyz * _Freq;
         	vec3 binormal = cross(gl_Normal, Tangent.xyz) * Tangent.w;
            src.xyz = src.xyz +
               Tangent.xyz * fbm(crd + _OffsU) * _Amp.x +
               binormal    * fbm(crd + _OffsV) * _Amp.y +
               gl_Normal   * fbm(crd + _OffsW) * _Amp.z;
            return src;
         }
 
         void main() {
            gl_Position = gl_ModelViewProjectionMatrix * modify_vertex(gl_Vertex);
         }
 
         #endif
 
         #ifdef FRAGMENT
 
         void main() {
            gl_FragColor = _Color;
         }
 
         #endif
 
         ENDGLSL
      }
   }
}