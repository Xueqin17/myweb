export default function AboutPage() {
  return (
    
      <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <p>Name: Xueqin HE</p>
      <p>Student No: 22144656</p>
      <p>My CSE5006 Assignment 1 demo video.</p>

      <div style={{ position: 'relative', paddingTop: '50%' }}>
        <iframe
          src="https://www.youtube.com/embed/REPLACE_WITH_YOUR_VIDEO_ID" // 
          title="Assignment 1 Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0
          }}
        />
      </div>
    </main>
   
  );
}