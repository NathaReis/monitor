// THEME
import { ThemeService } from './services/theme.service.js';
const $html = document.querySelector("html");
const $header = document.querySelector("header");
const theme = new ThemeService($header, $html);
theme.getTheme();

// // LOADING
// function createLoading() {
//   $html.innerHTML += `
//     <div id="loading">
//         <svg viewbox="0 0 100 20">
//             <defs>
//               <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="5%" stop-color="#326384"/>
//                 <stop offset="95%" stop-color="#123752"/>
//               </linearGradient>
//               <pattern id="wave" x="0" y="0" width="120" height="20" patternUnits="userSpaceOnUse">
//                 <path id="wavePath" d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" mask="url(#mask)" fill="url(#gradient)"> 
//                   <animateTransform
//                       attributeName="transform"
//                       begin="0s"
//                       dur="1.5s"
//                       type="translate"
//                       from="0,0"
//                       to="40,0"
//                       repeatCount="indefinite" />
//                 </path>
//               </pattern>
//             </defs>
//             <text text-anchor="middle" x="50" y="15" font-size="17" fill="url(#wave)"  fill-opacity="0.6" class="no-select">LOADING</text>
//             <text text-anchor="middle" x="50" y="15" font-size="17" fill="url(#gradient)" fill-opacity="0.1" class="no-select">LOADING</text>
//         </svg>    
//     </div>`
// }

// window.loading = (active) => {
//   if(active) return createLoading();
//   const $loading = document.querySelector("#loading");
//   $loading.remove();
// }