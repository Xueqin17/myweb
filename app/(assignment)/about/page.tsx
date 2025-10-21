export default function AboutPage() {
  return (
    
      <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p>Name: Xueqin HE</p>
      <p>Student No: 22144656</p>
      <p>My CSE5006 Assignment 2 video.</p>

      
       <video controls width="90%" style={{ marginTop: '20px', borderRadius: '8px' }}>
        <source src="/my_part2.mp4" type="video/mp4" />
       
      </video>
      
    </main>
   
  );
}