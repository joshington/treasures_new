

import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const DocumentList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
`;

const DocumentItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DocumentName = styled.h3`
  margin: 0;
  color: #0070f3;
`;

const TrusteeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.5rem;
`;

const TrusteeItem = styled.li`
  color: #555;
`;

const NoDocuments = styled.p`
  color: #888;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0070f3;
    color: white;
  }
`;

const AddTrusteeButton = styled.button`
  margin-top: auto; /* Align button halfway down */
  padding: 0.75rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const mockDocuments = [
  {
    name: "Document 1",
    trustees: ["Trustee A", "Trustee B"]
  },
  {
    name: "Document 2",
    trustees: ["Trustee C"]
  }
];

export default function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [showModal, setShowModal] = useState(false);
  const [newTrusteeEmail, setNewTrusteeEmail] = useState('');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Clear the input field for new trustee email
    setNewTrusteeEmail('');
  };

  const handleNewTrusteeEmailChange = (e) => {
    setNewTrusteeEmail(e.target.value);
  };

  const handleAddTrustee = (documentIndex) => {
    // Limit trustees to maximum 3
    if (documents[documentIndex].trustees.length >= 3) {
      alert('Maximum trustees (3) reached for this document.');
      return;
    }

    // Add trustee
    const updatedDocuments = [...documents];
    updatedDocuments[documentIndex].trustees.push(newTrusteeEmail);
    setDocuments(updatedDocuments);
    closeModal(); // Close the modal after adding trustee
  };

  return (
    <Container>
      {documents.length === 0 ? (
        <NoDocuments>No documents uploaded.</NoDocuments>
      ) : (
        <DocumentList>
          {documents.map((document, index) => (
            <DocumentItem key={index}>
              <DocumentName>{document.name}</DocumentName>
              <TrusteeList>
                {document.trustees.map((trustee, idx) => (
                  <TrusteeItem key={idx}>{trustee}</TrusteeItem>
                ))}
              </TrusteeList>
              <AddTrusteeButton onClick={openModal}>Add Trustee</AddTrusteeButton>
            </DocumentItem>
          ))}
        </DocumentList>
      )}
      {showModal && (
        <ModalBackground>
          <ModalContent>
            <h3>Add Trustee</h3>
            <Form onSubmit={(e) => { e.preventDefault(); handleAddTrustee(0); }}>
              <Input
                type="email"
                value={newTrusteeEmail}
                onChange={handleNewTrusteeEmailChange}
                placeholder="Enter trustee's email"
                required
              />
              <ButtonContainer>
                <Button type="button" onClick={closeModal}>Cancel</Button>
                <Button type="submit">Send Invite</Button>
              </ButtonContainer>
            </Form>
          </ModalContent>
        </ModalBackground>
      )}
    </Container>
  );
}
