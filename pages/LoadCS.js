import dynamic from "next/dynamic";

export default function LoadCS(component) {
  return dynamic(() => import(`./components/${component}.jsx`), {
    ssr: false,
  });
}
