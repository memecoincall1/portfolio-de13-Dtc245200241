import { hoanProfile } from '@/lib/hoan-content';

export function HomePage() {
  return (
    <div id="home-page" className="page active">
      <div className="hero-video-bg" aria-hidden="true">
        <video
          className="hero-video"
          src="/preview.gif.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-video-overlay" />
      </div>
      <section className="hero hero-overlay-content">
        <div className="hero-intro">
          <h1 className="hero-name">{hoanProfile.name}</h1>
          <p className="hero-text">{hoanProfile.intro.en}</p>
          <p className="hero-text-vi">{hoanProfile.intro.vi}</p>
        </div>
      </section>
    </div>
  );
}
