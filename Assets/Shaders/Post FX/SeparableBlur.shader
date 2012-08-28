Shader "Post FX/SeparableBlur" {
	Properties {
		_MainTex ("Base", 2D) = "" {}
	}

	Subshader {
		Pass {
			Cull Off
			ZTest Always
			ZWrite Off
			Fog { Mode off }

			GLSLPROGRAM

			uniform sampler2D _MainTex;
			uniform vec4 offsets;
			varying vec2 uv;
			varying mediump vec4 delta[6];

			#ifdef VERTEX
			void main() {
	            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
				uv = gl_MultiTexCoord0.xy;
				delta[0] = uv.xyxy + offsets.xyxy * vec4(1, 0, -1,  0);
				delta[1] = uv.xyxy + offsets.xyxy * vec4(0, 1,  0, -1);
				delta[2] = uv.xyxy + offsets.xyxy * vec4(2, 0, -2,  0);
				delta[3] = uv.xyxy + offsets.xyxy * vec4(0, 2,  0, -2);
				delta[4] = uv.xyxy + offsets.xyxy * vec4(3, 0, -3,  0);
				delta[5] = uv.xyxy + offsets.xyxy * vec4(0, 3,  0, -3);
			}
			#endif

			#ifdef FRAGMENT
			void main() {
				gl_FragColor =
					0.4   * texture2D(_MainTex, uv) +
					0.075 * texture2D(_MainTex, delta[0].xy) +
					0.075 * texture2D(_MainTex, delta[0].zw) +
					0.075 * texture2D(_MainTex, delta[1].xy) +
					0.075 * texture2D(_MainTex, delta[1].zw) +
					0.05  * texture2D(_MainTex, delta[2].xy) +
					0.05  * texture2D(_MainTex, delta[2].zw) +
					0.05  * texture2D(_MainTex, delta[3].xy) +
					0.05  * texture2D(_MainTex, delta[3].zw) +
					0.025 * texture2D(_MainTex, delta[4].xy) +
					0.025 * texture2D(_MainTex, delta[4].zw) +
					0.025 * texture2D(_MainTex, delta[5].xy) +
					0.025 * texture2D(_MainTex, delta[5].zw);
			}
			#endif

			ENDGLSL
		}
	}
}
