import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseExtractedText } from '../../services/dataService'; 

const Result0 = ({ extractedText }) => {
    const [rows, setRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Effet pour parser le texte extrait au chargement du composant
    useEffect(() => {
        if (extractedText) {
            const parsedRows = parseExtractedText(extractedText); // Utiliser la fonction du service
            setRows(parsedRows);
        }
    }, [extractedText]);

    // Gestion de la sélection/désélection de toutes les lignes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        setRows(rows.map(row => ({ ...row, isSelected: isChecked })));
    };

    // Gestion de la sélection/désélection d'une ligne
    const handleRowSelect = (id) => {
        setRows(rows.map(row => 
            row.id === id ? { ...row, isSelected: !row.isSelected } : row
        ));
    };

    // Suppression des lignes sélectionnées
    const handleDeleteSelected = () => {
        const updatedRows = rows.filter(row => !row.isSelected);
        setRows(updatedRows);
        setSelectAll(false);
    };

    // Suppression d'une ligne spécifique
    const handleDeleteRow = (id) => {
        const updatedRows = rows.filter(row => row.id !== id);
        setRows(updatedRows);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">Extracted Text</h1>

                {/* Tableau des résultats */}
                <div className="mb-4">
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-2 text-left">Texte</th>
                                <th className="p-2 text-left">Note</th>
                                <th className="p-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id} className="border-b border-gray-300">
                                    {/* Case à cocher */}
                                    <td className="p-2 text-center border">
                                        <input
                                            type="checkbox"
                                            checked={row.isSelected}
                                            onChange={() => handleRowSelect(row.id)}
                                        />
                                    </td>

                                    {/* Texte éditable */}
                                    <td
                                        className="p-2 text-gray-800 text-lg cursor-pointer border"
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
                                        {row.text}
                                    </td>

                                    {/* Note éditable */}
                                    <td
                                        className="p-2 text-gray-800 text-lg border"
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
                                        {row.note}
                                    </td>

                                    {/* Bouton de suppression */}
                                    <td className="p-2 text-center border">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                                            onClick={() => handleDeleteRow(row.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                        onClick={handleDeleteSelected}
                    >
                        Supprimer sélectionnés
                    </button>
                    <Link
                        to="/"
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        Télécharger une autre image
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Result0;