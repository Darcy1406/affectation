import React from 'react'

export default function Footer() {
  return (
    
    <div className="h-[100px] relative" style={{clipPath: 'polygon(100% 10%, 0% 100%, 100% 100%)', background: '#ECF3F2'}}>
      <p className="text-right" style={{position: 'absolute', bottom: '5px', right: '15px'}}>
          &copy; 2026 - Affectation
      </p>
    </div>

  )
}