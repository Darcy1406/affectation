import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useHungarian } from "../Hooks/useHungarian";
import { AssignmentGraph } from "./AssignmentGraph";
import {premiere_etape_algo, soustraire_colonne_par_min_colonne, deuxieme_etape_algo, algo_marquage_colonne, algo_marquage_ligne} from "../Functions/Functions";

const agent = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
const tache = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']


export default function Algo() {

  const { solve } = useHungarian();

  const [assignment, setAssignment] = useState([]);

  const [newTab, setNewTab] = useState([])
  const [new_tab_1, setNewTab1] = useState([])
  const [result, setResult] = useState([])

  const [min_col_tab, setMinColTab] = useState([])
  const [min_ligne_tab, setMinLigneTab] = useState([])
  const min_tableau = useRef(0)

  const [algo, setAlgo] = useState("")
  const [type_resolution, setTypeResolution] = useState("")

  const tableau_ref = useRef(null);
  const etape = useRef(1);

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [dimension, setDimension] = useState(6);
  const [isMaxSize, setIsMaxSize] = useState(false);
  const [isMinSize, setIsMinSize] = useState(false);
  const [error, setError] = useState("");
  const [show_result, setShowResult] = useState('texte');

  const [costMatrix, setCostMatrix] = useState([]);
  const [costMatrixComplement, setCostMatrixComplement] = useState([])
  const [complementMaximisation, setComplementMaximisation] = useState(0)

  const [cout, setCout] = useState(0);


  const accumuler_les_couts = () => {
    const cout_actuel = cout 
    let cout_nouvel = 0;

    if( (min_col_tab.reduce((acc, current) => acc + current, 0) + min_ligne_tab.reduce((acc, current) => acc + current, 0)) <= cout_actuel){
      cout_nouvel = cout_actuel + min_tableau.current

    }
    else{
      cout_nouvel = min_col_tab.reduce((acc, current) => acc + current, 0) + min_ligne_tab.reduce((acc, current) => acc + current, 0)
    }

    setCout(cout_nouvel)
  }


  // Générer matrice carrée
  const generateMatrix = () => {
    const newMatrix = Array(dimension)
      .fill()
      .map(() => Array(dimension).fill(""));
    setCostMatrix(newMatrix);
    setIsSubmitted(false);
  };


  // Mise à jour d'une cellule
  const handleChange = (i, j, value) => {
    const newMatrix = [...costMatrix];
    newMatrix[i][j] = Number(value);
    setCostMatrix(newMatrix);
  };


  // Convertir en nombres (comme ton costMatrix)
  const getCostMatrix = () => {
    const matrix = costMatrix.map(row =>
      row.map(val => Number(val))
    );
    setCostMatrix(matrix);
    setIsSubmitted(true)
  };


  // Ajouter une nouvelle dimension dans le tableau de matrice
  const ajouter_dimension = () => {
    const size = dimension + 1;
    if(size > 8){
      setIsMaxSize(true)
    }else{
      setDimension(size);
      setIsMaxSize(false);
      setIsMinSize(false);
    }
  }


  // Reduire une dimension dans le tableau de matrice
  const reduire_dimension = () => {
    const size = dimension - 1;
    if(size < 3){
      setIsMinSize(true)
    }else{
      setDimension(size);
      setIsMaxSize(false);
      setIsMinSize(false);
    }
  }


  // Tout reinitialiser (donnees, etat, ...)
  const reinitialisation = (e) => {
    e.preventDefault();
    setNewTab([]);
    setNewTab1([]);
    setResult([]);
    setMinColTab([]);
    setMinLigneTab([]);
    setAlgo("");
    setTypeResolution("");
    generateMatrix();
    setCout(0)
    min_tableau.current = 0;
    etape.current = 1;
  }


  // Enlever les couleurs dans le tableau
  const enlever_les_couleurs = () => {

    const tbody = tableau_ref.current
    const body = tableau_ref.current.children[1].children;
    

    for (let i = 0; i < body.length; i++) {
      const tr_tab = body[i]
      const td_tab = tr_tab.children

      if(tr_tab.style.backgroundColor != ''){
        tr_tab.style.removeProperty('background-color');

        for (let j = 0; j < td_tab.length; j++) {
          td_tab[j].style.color = 'black';
          td_tab[j].style.fontWeight = '500';
          if(td_tab[j].style.backgroundColor != ''){
            td_tab[j].style.removeProperty('background-color');
          }
          
        }
        
      }
      else{
        for (let k = 0; k < td_tab.length; k++) {
          td_tab[k].style.color = 'black';
          td_tab[k].style.fontWeight = '500';
          if(td_tab[k].style.backgroundColor != ''){
            td_tab[k].style.removeProperty('background-color');
          }
          
        }
      }
      
    }
  }


  // Transposer les donnees de l'interface vers une variable (costMatrix)
  const transposer_les_donnees_interface_vers_variable = () => {
    const body = tableau_ref.current.children[1].children;
    let dataset = [];
    for (let i = 0; i < body.length; i++) {
      const tr_tab = body[i];
      dataset[i] = []
      const td_tab = tr_tab.children
      for (let j = 1; j < td_tab.length; j++) {
        dataset[i].push(Number(td_tab[j].textContent));
      }
      
    }
    
    setNewTab1(dataset)
    
  }


  // ETAPE 4 : Soustraire chaque par le minimum de sa ligne
  const soustraire_ligne_par_min_ligne = (tableau, min_ligne_tab) => {
    let tab = [];

    for( let colonne=0; colonne < tableau.length; colonne++ ){
        tab[colonne] = []
        for (let i = 0; i < tableau.length; i++) {
          tab[colonne][i] = tableau[colonne][i] - min_ligne_tab[colonne]
        }

    }

    return tab;

  }


  // ETAPE 5 : Encadrer, barrer
  const encadrer_barrer = () => {

    let dataset = new_tab_1.map(row => [...row]);
    
    while(dataset.some(sousTableau => sousTableau.includes(0))){

      // IMPORTANT : Identifier les lignes qui contiennent une seule zero
      
      for (let i = 0; i < dataset.length; i++) {
  
        const count = dataset[i].filter(x => x==0).length
        // console.log('toy', count);
        if(count == 1){
          const index = dataset[i].indexOf(0)
          dataset[i][index] = "OK"
          i = -1;
          // console.log('toy', index);
          
  
          for (let j = 0; j < dataset.length; j++) {
            if(dataset[j][index] == 0){
              dataset[j][index] = 'Ø'
            }
            
          }
  
        }

      }

      // IMPORTANT : Identifier les lignes qui contiennent une seule zero
      for (let i = 0; i < dataset.length; i++) {

        const count = dataset[i].filter(x => x==0).length
        // console.log('count', count);
        
          if(count > 1){
            const indexes = dataset[i].map((val, j) => val === 0 ? j : -1).filter(j => j !== -1)
            
            dataset[i][indexes[0]] = "OK"

            for (let k = 1; k < indexes.length; k++) {
              dataset[i][indexes[k]] = 'Ø'
            }

          }

      }
      
      
  
    }


    setNewTab1(dataset);
    
  }


  // ETAPE 6 de l'algorithme Hongrois: Marquage
  const marquage = () => {

    let index_marquage_ligne = -1;
    let indice_marquage_colonne = -1;
    let dataset = new_tab_1.map(row => [...row]);
    // let dataset = new_tab_1
    // console.log('dataset', dataset);
    

    for (let i = 0; i < dataset.length; i++) {

      if( dataset[i].includes('Ø') && !(dataset[i].includes('OK')) ){
        dataset[i].push('+')
        index_marquage_ligne = i;
      }
      
    }

    if(index_marquage_ligne == -1 && indice_marquage_colonne == -1){
      let resultat = []
      etape.current = -1;
      for (let i = 0; i < dataset.length; i++) {
        resultat.push(dataset[i].indexOf('OK'))
      }
      setResult(resultat)
      
      
    }
    else{

      dataset[dataset.length] = [];
      for(let j = 0; j < dataset[0].length; j++) {
        
        dataset[dataset.length - 1][j] = '';
        
      }
  
      while(index_marquage_ligne != -1 || indice_marquage_colonne != -1){
        
        indice_marquage_colonne = algo_marquage_colonne(dataset, index_marquage_ligne)
        index_marquage_ligne = algo_marquage_ligne(dataset, indice_marquage_colonne)
       
      }
  
      setNewTab1(dataset)

    }
    
    
  }


  // ETAPE 7 : Coloriage ligne
  const coloriage_ligne = () => {
    const body = tableau_ref.current.children[1].children;
    let texte = '';

    for (let i = 0; i < body.length; i++) {
      const tr = body[i].children

      for (let j = 0; j < tr.length; j++) {
        const td = tr[j];
        texte += td.textContent; 
      }
      
      if(!texte.includes('+')){
        body[i].style.backgroundColor = 'yellow';
      }

      texte = ''
      // console.log('style', body[i].style[0] != undefined);
      

    }
  }


  // Etape 8 : Coloriage colonne
  const coloriage_colonne = () => {
    const body = tableau_ref.current.children[1].children;

    const indexes = Array.from(body[body.length-1].children).map((val, j) => val.textContent == '+' ? j : -1).filter(j => j !== -1)

    for (let j = 0; j < (body.length - 1); j++) {
      const tr = body[j].children;

      for (let k = 0; k < indexes.length; k++) {
       
        if(tr[indexes[k]].parentNode.style[0] == 'background-color'){
          tr[indexes[k]].style.backgroundColor = 'violet';
        }
        else{
          tr[indexes[k]].style.backgroundColor = 'yellow';
        }
      
      }
      
      
    }
    
    
  }


  // Etape 9 : Trouver le minimum entre les nombres non colorés
  const trouver_minimum_nombre_non_coloree = () => {

    const body = tableau_ref.current.children[1].children;
    let min = 99999;
    let indice_min = [];

    const tr_non_coloree = Array.from(body).filter(tr => {
      if(tr.style.backgroundColor != ''){
        return false
      }
      // if(tr.style[0] == 'background-color'){
      //   return false
      // }
      return true
      
    })


    for (let i = 0; i < (tr_non_coloree.length-1); i++) {
      const td_tab = tr_non_coloree[i].children;
      for (let j = 1; j < td_tab.length; j++) {
        if(td_tab[j].style[0] != 'background-color' && Number.isInteger(Number(td_tab[j].textContent)) && Number.isInteger(min) && Number(td_tab[j].textContent) <= min ){
          min = Number(td_tab[j].textContent)
          indice_min = [i, j]
        }

        
      }
      
    }

    tr_non_coloree[indice_min[0]].children[indice_min[1]].style.color = 'mediumblue';
    tr_non_coloree[indice_min[0]].children[indice_min[1]].style.fontWeight = 'bold';

    replace_string_zero(new_tab_1);
    min_tableau.current = min;

  }


  // Remplacer les 'Ø' et les 'OK' par zéro
  const replace_string_zero = (tableau) => {
    const dataset = tableau;

    new_tab_1.forEach(item => {
      if(item.length > 6 ){
        item.pop()
      }
      for (let i = 0; i < item.length; i++) {
        if(item[i] == 'OK' || item[i] == 'Ø'){
          item[i] = 0
        }
        
      }
      
    })

    setNewTab1(new_tab_1.slice(0, -1));




  }


  // Soustraire et additionner les nombres dans la matrice avec le minimum du tableau
  const soutraire_et_additionner_les_nombres_de_la_matrice = (min) => {
    const body = tableau_ref.current.children[1].children;

    for (let i = 0; i < body.length; i++) {

      const tr = body[i];
      const td_tab = tr.children

      // console.log('toy', tr.style.backgroundColor);
      

      if(tr.style.backgroundColor == ''){
        
        for (let j = 1; j < td_tab.length; j++) {
            
          if(td_tab[j].style.backgroundColor == ''){
            td_tab[j].textContent = Number(td_tab[j].textContent) - min
          }
          
        }
      }
      else{
       
        for (let j = 1; j < td_tab.length; j++) {

          if(td_tab[j].style.backgroundColor != ''){
            td_tab[j].textContent = Number(td_tab[j].textContent) + min
          }
          
        }
      }
      
      
    }

    enlever_les_couleurs();
    transposer_les_donnees_interface_vers_variable()

    
  }


  // Transformer les donnees pour effectuer une maximisation (Complement)
  const transformation_des_donnees_pour_maximisation = () => {
    let max = 0;
    let complement = 0
    let dataset = costMatrix;
    let new_dataset = [];

    dataset.forEach(item => {
      if(max < Math.max(...item)){
        max = Math.max(...item)
      }
    })
    
    while(complement < max){
      complement += 10;
    }

    for (let i = 0; i < dataset.length; i++) {
      new_dataset[i] = [];
      for (let j = 0; j < dataset[i].length; j++) {
        new_dataset[i][j] = 100 - dataset[i][j]
      }
      
    }

    setCostMatrixComplement(new_dataset)
    setComplementMaximisation(complement)

    return new_dataset;
    
    
  }


  const execute_step_by_step_the_functions = (costMatrix) => {
   
    switch (etape.current) {

      case 1:

        const col_tab = premiere_etape_algo(costMatrix);
        setMinColTab(col_tab);
        break;

      case 2:

        const tab = soustraire_colonne_par_min_colonne(costMatrix, min_col_tab);
        setNewTab(tab);
        break;

      case 3:
        const ligne_tab = deuxieme_etape_algo(newTab);
        setMinLigneTab(ligne_tab);
        break;

      case 4:
        const nouveau_tableau = soustraire_ligne_par_min_ligne(newTab, min_ligne_tab);
        setNewTab1(nouveau_tableau);
        break;

      case 5:
        encadrer_barrer();
        break;

      case 6:
        marquage();
        break;

      case 7:
        coloriage_ligne();
        break;

      case 8:
        coloriage_colonne();
        break;

      case 9:
        trouver_minimum_nombre_non_coloree();
        break;

      case 10:
        soutraire_et_additionner_les_nombres_de_la_matrice(min_tableau.current);
        etape.current = 4
        break;
    
      default:
        alert('default')
        break;

    }
    etape.current = etape.current + 1;
  }


  // Fonction pour trouver l'affectation optimale (simplifié)
  function hungarianAlgorithm(matrix) {
    try {
      const assignment = solve(matrix);
      let cout_total = 0;

      for(let i=0; i<costMatrix.length; i++){
        cout_total = cout_total + costMatrix[i][assignment[i]]
      }
      
      setCout(cout_total);
      setResult(assignment);
    } catch (error) {
      console.error("Erreur lors du calcul :", error);
    }
  }


  // Envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(costMatrix.some(data => data.includes(''))){
      setError("Veuillez complétez toutes les données");
      return;
    }
    setError("");
    setIsSubmitted(true);
    // getCostMatrix();


    if(algo === 'minimisation'){

      if(type_resolution == 'etape'){
        execute_step_by_step_the_functions(costMatrix);
      }
      else{
        hungarianAlgorithm(costMatrix);
      }

    }
    else{

      if(costMatrixComplement.length == 0){
        transformation_des_donnees_pour_maximisation();
      }

      if(type_resolution == 'etape' && costMatrixComplement.length > 0){
        execute_step_by_step_the_functions(costMatrixComplement);
      }
      
      if(type_resolution == 'resultat'){
        const complement = transformation_des_donnees_pour_maximisation();
        hungarianAlgorithm(complement);
      }
    }

    
    
  }


  useEffect(() => {
    generateMatrix()
    
  }, [dimension])


  useEffect(() => {

      accumuler_les_couts()    
    
  }, [min_col_tab, min_ligne_tab, min_tableau.current])


  return (
    <div className="flex justify-center max-xl:flex-wrap w-9/10 min-w-[310px] gap-2 mx-auto bg-gray-100 rounded-sl shadow-sm px-6 relative top-4 py-6">

      {/* Description */}
      <div className="w-[500px] min-w-[300px] rounded-lg max-xl:hidden">

        <div className="bg-white rounded-lg p-4 shadow-sm">

          <p className="font-bold text-2xl">Les étapes de l'algorithme d'Hongrois</p>

          <ul className="px-4 text-[14px]">
              
            <li className="my-2">

                <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 1 && 'bg-pink-500 text-white'}`}>
                  1
                </span>

              Trouver le minimum de chaque colonne du tableau.
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 2 && 'bg-pink-500 text-white'}`}>
                2
              </span>
              Soustraire le nombre de chaque colonne par son minimum.
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 3 && 'bg-pink-500 text-white'}`}>
                3
              </span>
              Trouver le minimum de chaque ligne du tableau.
            </li>

            <li className="my-[6px]">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 4 && 'bg-pink-500 text-white'}`}>
                4
              </span>
              Soustraire le nombre de chaque ligne par son minimum
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 5 && 'bg-pink-500 text-white'}`}>
                5
              </span>
              Chercher à former une solution de valeur zero. Il suffit de chercher a affecter le maximum d'arcs du cout nul du dernier tableau par les étapes suivantes : 
              <ol className="px-6 text-[12px] text-gray-500 italic">
                <li>a. A chaque etape, choisir la ligne qui contient le moins de zeros libres</li>
                <li>b. Encadrer le premier zero de la ligne retenue et barrer ceux qui ne peuvent plus representer une affectation</li>
                <li>c. Revenir a a. jusqu'a ce tous les zeros soient encadres ou barres</li>
              </ol>
          
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 6 && 'bg-pink-500 text-white'}`}>
                6
              </span>
              Recherche d'un support minimal (ensemble de lignes et contenant tous les zero)
              <ol className="px-6 text-[12px] text-gray-500 italic">
                <li>
                  a. Marquer toute ligne n'ayant pas de zero encadre
                </li>
                <li>
                  b. Marque toute colonne ayant un zero barre sur une ligne marquee
                </li>
                <li>
                  c. Marquer toute ligne ayant un zero encadre dans une colonne marquee
                </li>
              </ol>
              Revenir a b. et s'arreter lorsqu'aucun autre marquage n'est possible
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 9 && 'bg-pink-500 text-white'}`}>
                  7
              </span>
              Colorier les lignes non marquées, les colonnes marquées et identifier le <span className="text-blue-600 font-bold underline">minimum</span> entre les nombres non coloriés du tableau.
            </li>

            <li className="my-2">
              <span className={`mr-1 text-lg border border-pink-500 px-2 rounded-sm ${etape.current > 9 && 'bg-pink-500 text-white'}`}>
                8
              </span>
              Garder les nombres coloriés en <span className="font-bold underline text-yellow-400">jaune</span>, additionner les nombres coloriés en <span className="text-violet-500 font-bold underline">violet</span> avec le minimum et soustraire les nombres non coloriés par le minimum également.
              <strong className="block">(Revenir à létape 5 jusqu'à ce qu'on obtient le couple optimal)</strong>
            </li>

          </ul>
        </div>

      </div>

      {/* Tableau des coûts */}
      <div className="flex-1 max-w-[500px] max-lg:min-w-[400px] max-md:min-w-[300px] bg-white  rounded-lg shadow-sm pb-4">

        <h2 className="font-bold italic text-center text-2xl py-4">Problème d'Affectation</h2>

        <div className="flex flex-wrap items-center justify-center gap-4">

          {/* Conteneur données initiales */}
          <div className="w-full">

            <div className="flex items-center justify-center gap-6">
              <div>
                <p>Dimension : {dimension}x{dimension}</p>
              </div>

              <div className="flex gap-4">
                <button className="bg-pink-400 text-white px-4 py-1 rounded-sm cursor-pointer duration-150 ease-out hover:bg-pink-500" onClick={reduire_dimension}>
                  <span className="icon">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                </button>

                <button className="bg-pink-400 text-white px-4 py-1 rounded-sm cursor-pointer duration-150 ease-out hover:bg-pink-500" onClick={ajouter_dimension}>
                  <span className="icon">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </button>
                
              </div>

            </div>

            {
              isMinSize && (
                <p className="text-red-500 text-center">Vous avez déjà atteint la dimension minimale : {dimension}</p>
              )
            }
            
            {
              isMaxSize && (
                <p className="text-red-500 text-center">Vous avez déjà atteint la dimension maximale : {dimension}</p>
              )
            }

            
            {/* Données initales */}
            <table className="mx-auto w-auto table-auto border-collapse">

              <thead>
                <tr>
                  <th></th>
                  {
                    costMatrix.map((_, i) => (
                      <th key={i}>{tache[i]}</th>
                    ))
                  }
                </tr>
              </thead>

              <tbody>
                {costMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="font-bold px-2">{agent[i]}</td>
                    {row.map((val, j) => (
                      <td key={j} className={`${isSubmitted && 'px-2'} border border-black text-center`}>
                        {
                          isSubmitted ? (
                            val
                          ) : (
                            <input
                            className="px-1 w-[45px] outline-blue-700"
                              type="number"
                              placeholder={`${agent[i]}${tache[j]}`}
                              value={val}
                              onChange={(e) => handleChange(i, j, e.target.value)}
                              min={0}
                            />

                          )
                        }

                      </td>
                    ))}
                  </tr>

                ))}
                
                {
                  min_col_tab.length > 0 && costMatrixComplement.length == 0 && etape.current != 0 && (

                    <tr>
                      <td></td>
                      {
                        min_col_tab.length > 0 && min_col_tab.map((item, i) => (
                          <td key={i} className="text-center font-semibold text-red-500">{item}</td>
                        ))
                      }
                    </tr>
                  
                  )

                }

              </tbody>

            </table>

            
            {
              error != '' && (
                <p className="text-center text-red-500 my-2">{error}</p>
              )
            }

            {/* Cout total */}
            { 
              algo != '' ?
                complementMaximisation != 0 && algo == 'etape' ?
                  <p className="text-center font-thin my-2">Coût total {algo} = <span className="text-red-500 font-bold text-lg">{ (complementMaximisation * dimension) - cout}</span> </p>
                : 
                  <p className="text-center font-thin my-2">Coût total {algo} = <span className="text-red-500 font-bold text-lg">{cout}</span> </p>
              : 
                null
            }


            {/* Complément (maximisation) => statique */}
            {
              costMatrixComplement.length > 0 && type_resolution != 'resultat' && etape.current != 0 && (
                <div className="my-4">
                  <p className="text-center text-xl font-semibold text-green-400">- Complément à {complementMaximisation} -</p>
                  <table className="mx-auto w-auto table-auto border-collapse">

                    <thead>
                      <tr>
                        <th> </th>
                        {
                          costMatrixComplement[0].map((_, j) => (
                            <th key={j}>{tache[j]}</th>
                          ))
                        }
                      </tr>
                    </thead>

                    <tbody>
                      {
                        costMatrixComplement.map((row, i) => (
                          <tr key={i}>
                            <td className="font-bold">{agent[i]}</td>
                            {
                              row.map((cost, j) => (
                                <td key={j} className="px-2 border border-black text-center">
                                  {cost}
                                </td>
                              ))
                            }
                          </tr>
                        ))
                      }

                      {
                        min_col_tab.length > 0 && (

                          <tr>
                            <td></td>
                            {
                              min_col_tab.length > 0 && min_col_tab.map((item, i) => (
                                <td key={i} className="text-center font-semibold text-red-500">{item}</td>
                              ))
                            }
                          </tr>
                        
                        )

                      }
                    </tbody>

                  </table>  
                </div>
              )
            }

          </div>
            

          


          {/* Table 2 => statique */}
          {
            (newTab.length > 0 && etape.current != 0) && (

              <table className="w-1/2 table-auto border-collapse">

                <thead>
                  <tr>
                    <th> </th>
                    {
                      costMatrix[0].map((_, j) => (
                        <th key={j}>{tache[j]}</th>
                      ))
                    }
                  </tr>
                </thead>

                <tbody>
                  {
                    newTab?.map((row, i) => (
                      <tr key={i}>
                        <td className="font-bold">{agent[i]}</td>
                        {
                          row.map((cost, j) => (
                            <td key={j} className="border border-black text-center">
                              {cost}
                            </td>
                          ))
                        }
                        {
                          min_ligne_tab.length > 0 && (
                            <td className="text-center text-red-500 font-semibold">{min_ligne_tab[i]}</td>
                          )
                        }
                      </tr>
                    ))
                  }
                </tbody>

              </table>

            )
          }

          {/* Table 3 => dynamique */}
          {
            new_tab_1.length > 0 &&  (

              <table className="w-1/2 table-auto border-collapse" ref={tableau_ref}>

                <thead>
                  <tr>
                    <th> </th>
                    {
                      costMatrix[0].map((_, j) => (
                        <th key={j}>{tache[j]}</th>
                      ))
                    }
                  </tr>
                </thead>

                <tbody>
                  {
                    new_tab_1.map((row, i) => (
                      <tr key={i}>
                        <td className="font-bold">{ !row.includes('') ? agent[i] : ''}</td>
                        {
                          row.map((cost, j) => (
                            <td className={ (cost != '' && cost != '+') || Number.isInteger(cost) ? "text-center border border-black" : "text-center" } key={j} style={{
                              color: cost == 'OK' ? 'green' : cost == "Ø" ? 'red' : '',
                              fontWeight: cost == 'OK' ? 'bold' : cost == "Ø" ? 'bold' : ''
                              }}
                            >
                              {cost}
                            </td>
                          ))
                        }
                      </tr>
                    ))
                  
                  }
                </tbody>

              </table>

            )
          }

          {
            result.length > 0 && (
              <div className="container-result w-full px-6 my-2">

                  <p className="underline font-semibold text-xl">Résultat : </p>

                  <div className="flex gap-4 my-2">

                    <label htmlFor="">
                      <input 
                        type="radio" 
                        name="" 
                        id="" 
                        className="mx-1"
                        value='texte'
                        checked={show_result === 'texte'}
                        onChange={(e) => setShowResult(e.target.value)}
                      />
                      Texte
                    </label>

                    <label htmlFor="">
                      <input 
                        type="radio" 
                        name="" 
                        id="" 
                        className="mx-1"
                        value='graphique'
                        checked={show_result === 'graphique'}
                        onChange={(e) => setShowResult(e.target.value)}
                      />

                      Graphique
                    </label>

                  </div>

                  <div className="affichage">
                    {
                      show_result === 'texte' ?
                        <div className="container-result w-full px-6 my-2">

                          <ul className="flex gap-4 flex-wrap">
                            {
                              costMatrix.map((item, index) => (
                                <li key={index}>({agent[index]}, {tache[result[index]]}) = {item[result[index]]}  { result.length > (index + 1) && ' ; ' }</li>
                              ))
                            }

                          </ul>

                        </div>
                      : 
                        <AssignmentGraph agents={agent.slice(0, costMatrix.length)} taches={tache.slice(0, costMatrix.length)} result={result} costMatrix={costMatrix}/>
                    }

                  </div>
                  
              </div>

              


            )
          }

        </div>


      </div>


      {/* Manipulation */}
      <div className="bloc-manipulation min-w-[330px] max-sm:min-w-[300px]">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-2xl text-center font-bold">Manipulation</p>
          <form onSubmit={etape.current >= 1 && result.length == 0 ? handleSubmit : reinitialisation}>

            <div className="bloc-algorithme my-2">
              <label className="block my-1 font-semibold">Algorithme :</label>
              <div className="flex flex-wrap items-center gap-4">
                  <div className="">
                    <input 
                      type="radio" 
                      name="algorithme" 
                      className={`${(etape.current > 1 || result.length > 0) && 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                      value='minimisation' 
                      checked={algo === 'minimisation'}
                      onChange={(e) => setAlgo(e.target.value)}
                      required
                      disabled={etape.current > 1 || result.length > 0}
                    />
                    Minimisation
                  </div>
                  <div className="">
                    <input 
                      type="radio" 
                      name="algorithme" 
                      className={`${(etape.current > 1 || result.length > 0) && 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                      value='maximisation' 
                      checked={algo === 'maximisation'}
                      onChange={(e) => setAlgo(e.target.value)}
                      disabled={etape.current > 1 || result.length > 0}
                    />
                    Maximisation
                  </div>
              </div>
            </div>

            <div className="action my-2">
              <label className="block my-1 font-semibold">Action :</label>

              <div className="select">

                <select name="" id="action" className={`border border-gray-200 p-2 rounded-sm ${(etape.current > 1 || result.length > 0) && 'bg-gray-50 text-gray-300 cursor-not-allowed'}`} value={type_resolution} onChange={(e) => setTypeResolution(e.target.value)} required disabled={etape.current > 1 || result.length > 0}>
                  <option value="">Veuillez choisir le mode de resolution</option>
                  <option value="etape">Etape par étape</option>
                  <option value="resultat">Voir le résultat directement</option>
                </select>

              </div>
            </div>

            <div className="my-6 flex gap-8 items-center">
              {
                result.length > 0 ?
                  <button className="bg-red-400 text-white border border-white px-6 py-2 rounded-lg cursor-pointer duration-150 ease-out hover:bg-white hover:text-red-400 hover:border-red-400">
                    Réinitialiser ?
                  </button>
                : 
                  <button className="bg-black text-white px-6 py-2 rounded-lg cursor-pointer border border-white duration-150 ease-out hover:bg-white hover:text-black hover:border-black">
                    {
                      etape.current == 1 ?
                        <>
                          <span className="icon mx-1">
                            <i className="fas fa-play"></i>
                          </span>
                          Démarrer
                        </>
                      : 
                        <>
                          <span className="icon mx-1">
                            <i className="fas fa-arrow-right"></i>
                          </span>
                          Suivant
                        </>
                    }
                  </button>
              }

              
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
