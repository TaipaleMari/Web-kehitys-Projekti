import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Tervetuloa tehtäväsovellukseen!</h1>
      <p>Voit hallita omia päivittäisiä tehtäviäsi helposti.</p>
      <Link to="/login"><button>Kirjaudu</button></Link>
      <Link to="/register"><button>Rekisteröidy</button></Link>
    </div>
  );
}
