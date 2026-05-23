// Trouve le minimum dans une colonne
export const trouver_minimum_colonne = (tableau, colonne) => {
  let tab = []
  for (let i = 0; i < tableau.length; i++) {
    tab.push(tableau[i][colonne])
    
  }
 
  return Math.min(...tab);
}


// Trouve le minimum dans une ligne
export const trouver_minimum_ligne = (tableau, ligne) => {
  const min = Math.min(...tableau[ligne])

  return min;
}


// ETAPE 1 : Trouver le minimum de chaque colonne dans la matrice
export const premiere_etape_algo = (matrice) => {
  let min_col = [];
  for(let i=0; i<matrice.length; i++){
    
    min_col.push(trouver_minimum_colonne(matrice, i))
  }
  return min_col;
}


// ETAPE 2 : Soustraire les valeurs de chaque colonne par le minimum de sa colonne
export const soustraire_colonne_par_min_colonne = (tableau, min_col_tab) => {
    let tab = [];

    if(min_col_tab.length > 0){

      for( let colonne=0; colonne < tableau.length; colonne++ ){
          tab[colonne] = []
          for (let i = 0; i < tableau.length; i++) {
            tab[colonne][i] = tableau[colonne][i] - min_col_tab[i]
          }
  
      }

    }

    return tab;

}


// ETAPE 3 : Trouver le minimum de chaque ligne dans la matrice
export const deuxieme_etape_algo = (tableau) => {
  let min_ligne = [];
  for(let i=0; i<tableau.length; i++){
    min_ligne.push(trouver_minimum_ligne(tableau, i))
  }
  return min_ligne;
}


export const algo_marquage_ligne = (dataset, indice_marquage_colonne) => {

    let index_marquage_ligne = [];   

    for(let i=0; i<indice_marquage_colonne.length; i++){

        for (let k = 0; k < dataset.length; k++) {
          
          if(dataset[k][indice_marquage_colonne[i]] == 'OK'){
            dataset[k].push('+')
            index_marquage_ligne.push(k)
          }
          
        }

    }

    return index_marquage_ligne;
    
}


export const algo_marquage_colonne = (dataset, index_marquage_ligne, tableau_initial) => {

  let indice_marquage_colonne = [];
  
  for(let i=0; i<index_marquage_ligne.length; i++){
      let tab = [];

      for (let j = 0; j < dataset.length; j++) {
      
        if(dataset[index_marquage_ligne[i]].reduce((acc, elem, k) => (elem == 'Ø' ? [...acc, k] : acc), []).includes(j) ){

          if(dataset[dataset.length - 1][j] == ''){
            dataset[dataset.length - 1][j] = '+'
          }else{
            dataset[dataset.length - 1][j] += '\n+'
          }

          indice_marquage_colonne.push(j)
        }
        
      }

  }
  
  return indice_marquage_colonne;
}


export const identifier_les_lignes_contenant_un_seul_zero = (tableau) => {
let dataset = tableau.map(row => [...row]);

for (let i = 0; i < dataset.length; i++) {
  
  const count = dataset[i].filter(x => x==0).length
  if(count == 1){
    const index = dataset[i].indexOf(0)
    
    dataset[i][index] = "OK"
    i = -1;

    for (let j = 0; j < dataset.length; j++) {
      if(dataset[j][index] == 0){
        dataset[j][index] = 'Ø'
      }
      
    }

  }
  
}
return dataset;
}


export const identifier_les_lignes_contenant_plusieurs_zero = (tableau) => {
  let dataset = tableau.map(row => [...row]);

  for (let i = 0; i < dataset.length; i++) {

    const count = dataset[i].filter(x => x==0).length
    
    if(count > 1){

      const indexes = dataset[i].map((val, j) => val === 0 ? j : -1).filter(j => j !== -1)
      
      dataset[i][indexes[0]] = "OK"
      
      // Barrer les zero sur la ligne
      for (let k = 1; k < indexes.length; k++) {
        dataset[i][indexes[k]] = 'Ø'
      }

      // Barrer les zero sur la colonne
      for (let l = 0; l < dataset.length; l++) {
        
        if(dataset[l][indexes[0]] == 0){
          dataset[l][indexes[0]] = 'Ø'
        }
        
      }

    }
    dataset = identifier_les_lignes_contenant_un_seul_zero(dataset)

  }

  return dataset;
}