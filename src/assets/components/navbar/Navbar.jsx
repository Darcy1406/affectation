import React from 'react'

export default function ({dimension, setDimension, etape, result, type_resolution, setTypeResolution}) {

    const handleChange = (e) => {
        const val = e.target.value === '' ? '' : Number(e.target.value);
        setDimension(val);
    }

  return (
    <div className='px-6 flex items-center'>

        {/* Action */}
        <div className="flex-1 bloc-action flex items-center gap-4 text-base">
            <label htmlFor="etape">
                <input 
                    className='mx-1'
                    type="radio"
                    name='action'
                    id='etape'
                    value={'etape'}
                    onChange={(e) => setTypeResolution(e.target.value)}
                    checked={type_resolution == 'etape'} 
                />
                Etape par étape
            </label>
            <label htmlFor="resultat">
                <input 
                    className='mx-1'
                    type="radio"
                    name='action'
                    id='resultat'
                    value={'resultat'}
                    onChange={(e) => setTypeResolution(e.target.value)}
                    checked={type_resolution == 'resultat'} 
                />
                Afficher le résultat directement
            </label>

        </div>

    
        <div className="py-2 flex items-center gap-2">
            <label className="block my-2 font-semibold">Dimension : </label>

            <div className="flex items-center gap-2">

                <div className="">
                    <input 
                    type="number" 
                    className="w-12 h-8 bg-white border border-gray-200 rounded-sm text-center"
                    value={dimension}
                    onChange={handleChange}
                    min="4"
                    max="8"
                    />
                    
                </div>

                <div className="">
                    x
                </div>

                <div className="">
                    <input 
                    type="number" 
                    className="w-12 h-8 bg-white border border-gray-200 rounded-sm text-center"
                    value={dimension}
                    onChange={handleChange}
                    min="4"
                    max="8"
                    />
                    
                </div>    
                    
            </div>
        </div>
    </div>
  )
}
