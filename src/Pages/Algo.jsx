import React, { useState, useEffect, useMemo } from "react";
import { useRef } from "react";
import { useHungarian } from "../Hooks/useHungarian";
import { AssignmentGraph } from "./AssignmentGraph";
import Navbar from "../assets/components/navbar/Navbar";
import {premiere_etape_algo, soustraire_colonne_par_min_colonne, deuxieme_etape_algo, algo_marquage_colonne, algo_marquage_ligne, identifier_les_lignes_contenant_un_seul_zero, identifier_les_lignes_contenant_plusieurs_zero} from "../Functions/Functions";

const agent = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
const tache = ['1', '2', '3', '4', '5', '6', '7', '8', '9']


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
  const [type_resolution, setTypeResolution] = useState("etape")

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
  const [nb_ligne_marque, setNbLigneMarque] = useState(0)


  const accumuler_les_couts = () => {
    const cout_actuel = cout
    let cout_nouvel = 0;

    if( (min_col_tab.reduce((acc, current) => acc + current, 0) + min_ligne_tab.reduce((acc, current) => acc + current, 0)) <= cout_actuel){
      cout_nouvel = cout_actuel + ( nb_ligne_marque * min_tableau.current)

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


  // // Convertir en nombres (comme ton costMatrix)
  // const getCostMatrix = () => {
  //   const matrix = costMatrix.map(row =>
  //     row.map(val => Number(val))
  //   );
  //   setCostMatrix(matrix);
  //   setIsSubmitted(true)
  // };


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
    if(size < 4){
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
    setCostMatrixComplement([]);
    setComplementMaximisation(0);
    setCout(0)
    setNbLigneMarque(0)
    setIsSubmitted(false);
    min_tableau.current = 0;
    etape.current = 1;
  }

  const modifier_data_et_relancer = () => {
    setNewTab([]);
    setNewTab1([]);
    setResult([]);
    setMinColTab([]);
    setMinLigneTab([]);
    setCostMatrixComplement([]);
    setComplementMaximisation(0);
    setCout(0)
    setNbLigneMarque(0)
    setIsSubmitted(false);
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
          td_tab[j].style.fontWeight = 'initial';
          if(td_tab[j].style.backgroundColor != ''){
            td_tab[j].style.removeProperty('background-color');
          }

        }

      }
      else{
        for (let k = 0; k < td_tab.length; k++) {
          td_tab[k].style.color = 'black';
          td_tab[k].style.fontWeight = 'initial';
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
    let new_dataset = identifier_les_lignes_contenant_plusieurs_zero(identifier_les_lignes_contenant_un_seul_zero(dataset))
    setNewTab1(new_dataset);

  }


  // ETAPE 6 de l'algorithme Hongrois: Marquage (OK)
  const marquage = () => {

    let index_marquage_ligne = [];
    let indice_marquage_colonne = [];
    let nombre_de_lignes_marque = 0;
    let dataset = new_tab_1.map(row => [...row]);

    // Déterminer les lignes contenant Ø et ne contenant pas OK
    for (let i = 0; i < dataset.length; i++) {

      if( dataset[i].includes('Ø') && !(dataset[i].includes('OK')) ){
        dataset[i].push('+')
        index_marquage_ligne.push(i)
        nombre_de_lignes_marque = nombre_de_lignes_marque + 1;
      }

    }
    setNbLigneMarque(nombre_de_lignes_marque);

    // Récupérer le résultat s'il n'y a plus de marquage possible
    if(index_marquage_ligne.length == 0 && indice_marquage_colonne.length == 0){
      let resultat = []
      etape.current = -1;
      for (let i = 0; i < dataset.length; i++) {
        resultat.push(dataset[i].indexOf('OK'))
      }
      setResult(resultat)

    }

    else{

      // for (let j = 0; j < nombre_de_lignes_marque; j++) {
        dataset[dataset.length] = [];
        for(let k = 0; k < dataset[0].length; k++) {

          dataset[dataset.length - 1][k] = '';

        }
      // }


      while(index_marquage_ligne.length != 0 || indice_marquage_colonne.length != 0){

        indice_marquage_colonne = algo_marquage_colonne(dataset, index_marquage_ligne, costMatrix)
        index_marquage_ligne = algo_marquage_ligne(dataset, indice_marquage_colonne)
        setNewTab1(dataset)

      }

    }
  }


  // ETAPE 7 : Coloriage ligne (OK)
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

    }
  }


  // Etape 8 : Coloriage colonne (OK)
  const coloriage_colonne = () => {
    const body = tableau_ref.current.children[1].children;


    const indexes = Array.from(body[body.length-1].children).map((val, j) => ( typeof val.textContent === 'string' && (val.textContent).includes('+')) ? j : -1).filter(j => j !== -1)

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
    // alert('ato letsefd')
    const body = tableau_ref.current.children[1].children;
    let min = 99999;
    let indice_min = [];
    let current_row = [];

    const tr_non_coloree = Array.from(body).slice(0, costMatrix.length).filter(tr => {
      if(tr.style.backgroundColor != ''){
        return false
      }
      // if(tr.style[0] == 'background-color'){
      //   return false
      // }
      return true

    })

    // console.log('tr non colore', tr_non_coloree);

    // Trouver le minimum
    for (let i = 0; i < (tr_non_coloree.length); i++) {
      const td_tab = tr_non_coloree[i].children;

      for (let j = 1; j < td_tab.length; j++) {

        // if(Number(td_tab[j].textContent) != NaN){
        //   current_row.push(Number(td_tab[j].textContent))

        // }

        if(td_tab[j].style.backgroundColor == '' && Number.isInteger(Number(td_tab[j].textContent)) && Number.isInteger(min) && Number(td_tab[j].textContent) <= min ){
          min = Number(td_tab[j].textContent)
          indice_min = [i, j]
        }

        // if(td_tab[j].style[0] != 'background-color' && Number.isInteger(Number(td_tab[j].textContent)) && Number.isInteger(min) && Number(td_tab[j].textContent) <= min ){
        //   min = Number(td_tab[j].textContent)
        //   indice_min = [i, j]
        // }

      }
      // console.log('current row', current_row);
      // current_row = [];
      

    }

    // console.log('indice min', indice_min);
    tr_non_coloree[indice_min[0]].children[indice_min[1]].style.color = 'red';
    tr_non_coloree[indice_min[0]].children[indice_min[1]].style.fontWeight = 'bold';

    replace_string_zero(new_tab_1);
    min_tableau.current = min;

  }


  // Remplacer les 'Ø' et les 'OK' par zéro
  const replace_string_zero = (tableau) => {
    let dataset = tableau.map(row => [...row]);

    dataset.forEach(item => {
      if(item.length > costMatrix.length ){
        item.pop()
      }
      for (let i = 0; i < item.length; i++) {
        if(item[i] == 'OK' || item[i] == 'Ø'){
          item[i] = 0
        }

      }

    })

    dataset = dataset.slice(0, (costMatrix.length));

    const new_tableau = dataset.map(row => [...row.slice(0, (dataset.length))])

    setNewTab1(new_tableau);

  }


  // Soustraire et additionner les nombres dans la matrice avec le minimum du tableau
  const soutraire_et_additionner_les_nombres_de_la_matrice = (min) => {
    const body = tableau_ref.current.children[1].children;

    for (let i = 0; i < body.length; i++) {

      const tr = body[i];
      const td_tab = tr.children

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
        new_dataset[i][j] = complement - dataset[i][j]
      }

    }

    setCostMatrixComplement(new_dataset)
    setComplementMaximisation(complement)

    return new_dataset;
  }


  const execute_step_by_step_the_functions = (costMatrix) => {
    // alert(etape.current)
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
    if(dimension > 8){
      setIsMinSize(false)
      setIsMaxSize(true)
      setDimension(8)
    }
    else if(dimension < 4){
      setIsMaxSize(false)
      setIsMinSize(true)
      setDimension(4)
    }
    else{
      generateMatrix()
    }
  }, [dimension])


  useEffect(() => {
    accumuler_les_couts()
  }, [min_col_tab, min_ligne_tab, min_tableau.current])

  useMemo(() => {
    if(etape.current > 1 || result.length > 0){
      modifier_data_et_relancer();
    }
  }, [costMatrix])


  return (
    <>
      {/* <Navbar dimension={dimension} setDimension={setDimension}/> */}
      <div className="w-2/4 min-w-[310px] pb-[70px] min-h-screen gap-2 mx-auto rounded-sl relative max-xl:flex-wrap max-sm:w-full">

        {/* Manipulation - item 1 */}
        <div className="relative">
          
          <div className="">
              <p className="text-lg font-semibold italic py-2">Problème d'affectation</p>

            {/* Formulaire de manipulation */}
              <form className="bg-white mx-auto py-1 rounded-sm shadow-sm flex gap-6 justify-center items-center" onSubmit={etape.current >= 1 && result.length == 0 ? handleSubmit : reinitialisation}>

                {/* Algorithme */}
                <div className="bloc-algorithme flex items-center gap-2 max-sm:text-xs">

                  <label className="block my-1 font-semibold">Algorithme :</label>
                  {
                    isSubmitted ?
                      <p className="text-orange-400">{algo}</p>
                    :
                      <div className="flex flex-wrap items-center">

                          <div className={`border border-gray-300 py-2 px-4 cursor-pointer ${algo == 'minimisation' ? 'bg-gray-300' : 'duration-150 ease-out hover:border-gray-400'}`} style={{borderRadius: "10px 0 0 10px"}} onClick={() => setAlgo("minimisation")}>
                            Minimisation
                          </div>

                          <div className={`border border-gray-300 py-2 px-4 cursor-pointer ${algo == 'maximisation' ? 'bg-gray-300' : 'duration-150 ease-out hover:border-gray-400'}`} style={{borderRadius: "0 10px 10px 0"}} onClick={() => setAlgo('maximisation')}>
                            Maximisation
                          </div>

                      </div>
                  }

                </div>

                {/* Bouton (Demarrer et Reinitialiser) */}
                <div className="my-2 flex gap-4 justify-center items-center max-sm:text-sm">

                  <button 
                    type="submit"
                    className={`text-sm px-6 py-2 rounded-lg ${result.length > 0 ? 'bg-orange-100 cursor-not-allowed text-orange-300' : 'bg-orange-400 text-white cursor-pointer duration-150 ease-out hover:bg-orange-500'}`}
                    disabled={result.length > 0}
                  >
                
                    <span className="icon mx-1">
                      <i className="fas fa-play"></i>
                    </span>
                    { etape.current == 1 && complementMaximisation == 0 ? 'Démarrer' : 'Suivant' }
                
                  </button>

                  <button 
                    type="button"
                    className={`text-sm px-6 py-2 rounded-lg ${result.length == 0 ? 'bg-red-100 cursor-not-allowed text-red-300' : 'bg-red-400 text-white cursor-pointer duration-150 ease-out hover:bg-red-500'}`}
                    onClick={reinitialisation}
                    disabled={result.length == 0}
                  >
                    Réinitialiser ?
                  </button>


                </div>
            

              </form>

          </div>

        </div>

        {/* Tableau des coûts - item 2 */}
        <div className="flex-1 px-4 py-6 max-sm:px-1">


            {/* Conteneur données initiales */}
            <div className="w-full flex justify-center flex-wrap gap-4">



              {/* Données initales - 1 */}
              <div className="">
              
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

                <table className="w-auto table-auto border-collapse max-sm:text-xs">

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
                          <td key={j} className={`border border-orange-300 text-center bg-white`}>
                              <input
                              className="px-1 w-[48px] max-sm:w-[35px] outline-blue-700 text-center"
                                type="number"
                                placeholder={`${agent[i]}${tache[j]}`}
                                value={val}
                                onChange={(e) => handleChange(i, j, e.target.value)}
                                min={0}
                              />
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
              </div>



              {/* Complément (maximisation) => statique - 2 */}
              {
                costMatrixComplement.length > 0 && type_resolution != 'resultat' && etape.current != 0 && (
                  <div className="">
                    <p className="text-center text-xl font-semibold text-green-400">- Complément à {complementMaximisation} -</p>
                    <table className="mx-auto w-auto table-auto border-collapse max-sm:text-xs">

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
                              <td className="font-bold px-2">{agent[i]}</td>
                              {
                                row.map((cost, j) => (
                                  <td key={j} className="px-2 border border-orange-300 text-center bg-white">
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

              {/* Table 2 => statique - 3 */}
              {
                (newTab.length > 0 && etape.current != 0) && (
                  <div className="">

                    <table className="w-auto mx-auto table-auto border-collapse max-sm:text-xs">

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
                              <td className="font-bold px-2">{agent[i]}</td>
                              {
                                row.map((cost, j) => (
                                  <td key={j} className="border border-orange-300 text-center px-2 bg-white">
                                    {cost}
                                  </td>
                                ))
                              }
                              {
                                min_ligne_tab.length > 0 && (
                                  <td className="text-center text-red-500 font-semibold px-2">{min_ligne_tab[i]}</td>
                                )
                              }
                            </tr>
                          ))
                        }
                      </tbody>

                    </table>

                  </div>

                )
              }

              {/* Table 3 => dynamique - 4 */}
              {
                new_tab_1.length > 0 &&  (
                  <div className="">

                    <table className="w-auto mx-auto table-auto border-collapse max-sm:text-xs" ref={tableau_ref}>

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
                              <td className="font-bold px-2">{ !row.includes('') ? agent[i] : ``}</td>
                              {
                                row.map((cost, j) => (
                                  <td
                                    className={
                                      `px-2
                                      
                                      ${ ( typeof cost === 'string' && (cost === '' || cost.includes('+'))) ? 
                                        "text-center" 
                                        : "text-center border border-orange-300"
                                      }`
                                    }
                                    key={j}
                                    style={{
                                      whiteSpace: 'pre-wrap',
                                      color: cost == 'OK' ? 'green' : cost == "Ø" ? 'red' : '',
                                      fontWeight: (cost === 'OK' || cost === 'Ø') ? 'bold' : 'initial'
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

                  </div>

                )
              }

            </div>
            
            {/* <hr className="w-9/10 mx-auto block my-6 text-gray-300"/> */}

        </div>

        <hr className="text-gray-300"/>


        {/* Résultat */}
        <div className="mx-auto my-4 rounded-lg px-4">
          <p className="underline text-xl">Résultat : </p>
          {/* Cout total */}
            

          {
            algo != '' && (
              complementMaximisation != 0 && type_resolution == 'etape' ?
                  <p className="font-thin my-4">B ({algo}) = <span className="text-red-500 font-bold text-lg">{ (complementMaximisation * dimension) - cout}</span> </p>
                :
                  <p className="font-thin my-4">B ({algo}) = <span className="text-red-500 font-bold text-lg">{cout}</span> </p>
            )
          }

          {
            result.length > 0 && (
              <div className="container-result w-full px-6 my-2">


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

                        <div className="container-result w-full my-2">
                          
                          <ul className="flex gap-4 flex-wrap">
                            {
                              costMatrix.map((item, index) => (
                                <li key={index}>({agent[index]}, {tache[result[index]]}) = {item[result[index]]}  { result.length > (index + 1) && ' ; ' }</li>
                              ))
                            }

                          </ul>

                        </div>
                      :
                        <div className="mx-auto">
                          <AssignmentGraph agents={agent.slice(0, costMatrix.length)} taches={tache.slice(0, costMatrix.length)} result={result} costMatrix={costMatrix}/>
                        </div>
                    }

                  </div>

              </div>
            ) 
          }

          {
            algo == '' && result.length == 0 && (
              <div className="my-2">
                <p className="text-xl text-red-400">
                  <span className="icon mr-2">
                    <i className="fas fa-times"></i>
                  </span>
                  Aucun résultat à afficher.
                </p>
              </div>
            )
          }
        </div>


        <div className="w-2/4 py-2 fixed bottom-0 rounded-sm shadow-sm" style={{background: '#ECF3F2'}}>
          <Navbar dimension={dimension} setDimension={setDimension} etape={etape} result={result} type_resolution={type_resolution} setTypeResolution={setTypeResolution}/>
        </div>


        
      </div>
    
    </>


  );
}