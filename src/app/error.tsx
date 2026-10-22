'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="inhoud" className="state"><h1>Even niet beschikbaar</h1><p>De inhoud kon niet worden gecontroleerd.</p><button onClick={reset}>Opnieuw proberen</button></main>;}
