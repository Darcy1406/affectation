import React from 'react';

/**
 * Composant de visualisation du Graphe d'Affectation
 * @param {Array} agents - Noms des agents (ex: ['A', 'B', 'C'])
 * @param {Array} taches - Noms des tâches (ex: ['a', 'b', 'c'])
 * @param {Array} result - Indices des tâches assignées par agent (ex: [0, 2, 1])
 * @param {Array} costMatrix - Matrice des coûts originale
 */
export const AssignmentGraph = ({ agents, taches, result, costMatrix }) => {
  // 1. Sécurité : On ne fait rien si les données sont incomplètes
  if (!result || !agents || !taches || !costMatrix || result.length === 0) {
    return (
      <div className="p-8 text-gray-400 italic text-center border-2 border-dashed rounded-xl">
        En attente des données d'affectation pour générer le graphique...
      </div>
    );
  }

  // 2. Paramètres de mise en page (Layout fixe pour éviter les espaces vides)
  const nodeRadius = 22;
  const paddingX = 100;    // Espace pour les étiquettes à gauche et à droite
  const verticalSpacing = 70; // Espace constant entre chaque nœud
  const width = 500;

  // Déterminer le nombre max d'éléments pour calculer la hauteur juste
  const maxElements = Math.max(agents.length, taches.length);
  
  // La hauteur s'adapte précisément au nombre d'éléments
  const height = (maxElements + 1) * verticalSpacing;

  // Fonction pour calculer la position Y (index commence à 0)
  const calculateY = (index) => (index + 1) * verticalSpacing;

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-100 my-4 overflow-x-auto">
      {/* <h3 className="text-lg font-bold mb-8 text-slate-700 uppercase tracking-wider">
        Graphique d'Affectation Optimale
      </h3> */}
      
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        className="max-w-full"
      >
        {/* Définition de la pointe de flèche */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
          </marker>
        </defs>

        {/* --- 1. DESSIN DES TÂCHES (À droite) --- */}
        {taches.map((tacheName, j) => {
          const xTache = width - paddingX;
          const yTache = calculateY(j);
          
          return (
            <g key={`task-${j}`}>
              <circle cx={xTache} cy={yTache} r={nodeRadius} fill="#F6339A" />
              <text 
                x={xTache + nodeRadius + 12} 
                y={yTache + 5} 
                className="text-sm font-semibold" 
                fill="#475569"
              >
                {tacheName}
              </text>
            </g>
          );
        })}

        {/* --- 2. DESSIN DES LIGNES D'AFFECTATION --- */}
        {agents.map((_, i) => {
          const xAgent = paddingX;
          const yAgent = calculateY(i);
          const taskIdx = result[i];

          // On ne dessine la ligne que si l'agent a une tâche valide
          if (taskIdx === undefined || taskIdx === -1 || !taches[taskIdx]) return null;

          const xTache = width - paddingX;
          const yTache = calculateY(taskIdx);

          return (
            <line 
              key={`line-${i}`}
              x1={xAgent + nodeRadius} 
              y1={yAgent} 
              x2={xTache - nodeRadius} 
              y2={yTache} 
              stroke="#000" 
              strokeWidth="3" 
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* --- 3. DESSIN DES AGENTS ET COÛTS (Par-dessus les lignes) --- */}
        {agents.map((agentName, i) => {
          const xAgent = paddingX;
          const yAgent = calculateY(i);
          const taskIdx = result[i];
          
          // Récupération sécurisée du coût
          const cost = (taskIdx !== undefined && costMatrix[i]) 
            ? costMatrix[i][taskIdx] 
            : '?';

          return (
            <g key={`agent-${i}`}>
              {/* Le nœud de l'agent */}
              <circle cx={xAgent} cy={yAgent} r={nodeRadius} fill="#1e293b" />
              
              {/* Le coût affiché AU CENTRE du nœud */}
              <text 
                x={xAgent} 
                y={yAgent + 5} 
                textAnchor="middle" 
                fontSize="12" 
                fontWeight="bold" 
                fill="white"
              >
                {cost}
              </text>

              {/* Le nom de l'agent à gauche du nœud */}
              <text 
                x={xAgent - nodeRadius - 12} 
                y={yAgent + 5} 
                textAnchor="end" 
                className="text-sm font-bold" 
                fill="#1e293b"
              >
                {agentName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AssignmentGraph;