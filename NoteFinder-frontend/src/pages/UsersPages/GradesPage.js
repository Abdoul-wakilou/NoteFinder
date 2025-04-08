import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import noteService from '../../services/noteService';

function GradesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMatricule, setSearchMatricule] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        
        if (location.state?.extractedNotes) {
          const convertedGrades = location.state.extractedNotes.map((note, index) => ({
            id: index + 1,
            matricule: note.matricule,
            nom: note.nom,
            prenom: note.prenom,
            note: note.note,
            ecue_id: note.ecue_id || 'N/A',
            annee_academique: note.annee_academique || 'N/A',
            date: note.date || new Date().toLocaleDateString()
          }));
          setGrades(convertedGrades);
          setFilteredGrades(convertedGrades);
        } else {
          const notesResponse = await noteService.fetchNotes();
          
          const formattedGrades = notesResponse.map(note => ({
            id: note[0],
            ecue_id: note[1],
            parcours_etudiant_id: note[2],
            note: note[3],
            date: new Date(note[4]).toLocaleDateString(),
            matricule: note[7] || 'N/A',
            nom: note[8] || 'N/A',
            prenom: note[9] || 'N/A',
            annee_etude: note[19] || 'N/A',
            annee_academique: note[25] || 'N/A'
          }));

          setGrades(formattedGrades);
          setFilteredGrades(formattedGrades);
          
          if (location.state?.studentMatricule) {
            setSearchMatricule(location.state.studentMatricule);
            const studentGrade = formattedGrades.find(g => g.matricule === location.state.studentMatricule);
            setStudentInfo({
              matricule: location.state.studentMatricule,
              nom: location.state.studentNom || studentGrade?.nom || 'N/A',
              prenom: location.state.studentPrenom || studentGrade?.prenom || 'N/A'
            });
          }
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [location.state]);

  useEffect(() => {
    if (searchMatricule) {
      const filtered = grades
        .filter(grade => {
          const matricule = grade.matricule?.toString() || '';
          return matricule.includes(searchMatricule);
        })
        .sort((a, b) => {
          const aYear = a.annee_academique || '';
          const bYear = b.annee_academique || '';
          return aYear.localeCompare(bYear);
        });
      setFilteredGrades(filtered);
    } else {
      setFilteredGrades([...grades].sort((a, b) => {
        const aYear = a.annee_academique || '';
        const bYear = b.annee_academique || '';
        return aYear.localeCompare(bYear);
      }));
    }
  }, [searchMatricule, grades]);

  const handleBackToDashboard = () => {
    navigate('/dash'); // Remplacez '/dashboard' par votre route de dashboard
  };

  if (loading) {
    return (
      <div style={{ 
        margin: '20px', 
        padding: '20px', 
        textAlign: 'center',
        color: '#64748b'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
        Chargement des notes...
      </div>
    );
  }

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      position: 'relative' // Pour positionner le bouton de retour
    }}>
      {/* Bouton de retour */}
      <button
        onClick={handleBackToDashboard}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <i className="fas fa-arrow-left"></i>
        Retour au dashboard
      </button>

      <h1 style={{ 
        fontSize: '24px',
        fontWeight: 600,
        color: '#4f46e5',
        textAlign: 'center',
        marginBottom: '20px',
        marginTop: '10px' // Ajustement pour le bouton
      }}>
        {studentInfo ? `Notes de l'étudiant ${studentInfo.prenom} ${studentInfo.nom}` : 'Notes des étudiants'}
      </h1>

      {!studentInfo && (
        <div style={{ marginBottom: '20px', marginTop: '40px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            color: '#334155'
          }}>
            Rechercher par matricule:
          </label>
          <input
            type="text"
            value={searchMatricule}
            onChange={(e) => setSearchMatricule(e.target.value)}
            placeholder="Entrez un matricule..."
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      )}

      {filteredGrades.length > 0 ? (
        <div style={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '20px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                {!studentInfo && (
                  <>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#64748b',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Matricule
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#64748b',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Nom
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#64748b',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Prénom
                    </th>
                  </>
                )}
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#64748b',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  ECUE
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#64748b',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Note
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#64748b',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Année Acad.
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#64748b',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {!studentInfo && (
                    <>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '14px', 
                        color: '#334155'
                      }}>
                        {grade.matricule}
                      </td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '14px', 
                        color: '#334155'
                      }}>
                        {grade.nom}
                      </td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '14px', 
                        color: '#334155'
                      }}>
                        {grade.prenom}
                      </td>
                    </>
                  )}
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px', 
                    color: '#334155'
                  }}>
                    {grade.ecue_id}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: grade.note >= 10 ? '#10b981' : '#ef4444',
                    textAlign: 'right'
                  }}>
                    {grade.note}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px', 
                    color: '#334155'
                  }}>
                    {grade.annee_academique}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px', 
                    color: '#334155'
                  }}>
                    {grade.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ 
          padding: '24px', 
          textAlign: 'center', 
          color: '#64748b',
          fontStyle: 'italic',
          marginTop: '20px'
        }}>
          Aucune note disponible {searchMatricule && `pour le matricule ${searchMatricule}`}
        </div>
      )}
    </div>
  );
}

export default GradesPage;