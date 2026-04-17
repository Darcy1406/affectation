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

    let index_marquage_ligne = -1;

    for (let k = 0; k < dataset.length; k++) {
      
      if(indice_marquage_colonne >= 0 && dataset[k][indice_marquage_colonne] == 'OK'){
        dataset[k].push('+')
        index_marquage_ligne = k
      }
      
    }

    return index_marquage_ligne;
    
}


export const algo_marquage_colonne = (dataset, index_marquage_ligne) => {

  let indice_marquage_colonne = -1;
  // console.log('index marquage ligne :', index_marquage_ligne);

  for (let j = 0; j < dataset[0].length; j++) {

    if(  index_marquage_ligne >=0 && j ==  dataset[index_marquage_ligne].indexOf('Ø') ){

      dataset[dataset.length - 1][j] = '+'
      indice_marquage_colonne = j

    }
    
  }

  return indice_marquage_colonne;

  
}