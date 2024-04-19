import React, { useState, useEffect } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon, Textarea, Flex, Select, Card} from '@chakra-ui/react';
import { CloseIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';

export const Cards = ({ myCardList, cardDescription }) => {
    // Access myObject here
    console.log(myCardList);
    const [displayCards, setDisplayCards] = useState([]);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [suggestedTitle, setSuggestedTitle] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    

    useEffect(() => {
        handleShowCards(); // Fetch data when component mounts
    }, []);

    const handleShowCards = async () => {
        var parts = myCardList.split('_');
        const ID = parts[1];
        try {
            const boardData = await fetch(`http://localhost:8000/boardly/card/get/cardlists?cardlist_id=${ID}`);
            if (!boardData.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await boardData.json();
            console.log(data);
  
            setDisplayCards(data);
        } catch (error) {
            console.error('Error showing cardlist:', error);
        }
    };

    const handleDeleteCard = async (cardID) => {
        // need to figure out how to get cardID from the card
        // console.log(cardID);
        var parts = cardID.split('_');
        cardID = parts[1];
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/delete?id=${cardID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Card deleted successfully:', data);
            handleShowCards(); // Refresh cards after deletion
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const handleEditTitle = async (cardID, newTitle) => {
        var fieldName = 'title';
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/update/field?card_id=${cardID}&field_name=${fieldName}&new_value=${newTitle}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Card title updated successfully:', data);
            handleShowCards(); // Refresh cards after updating title
            setEditingCardId(null); // Exit edit mode
            setEditingTitle(''); // Reset editing title
        } catch (error) {
            console.error('Error updating card title:', error);
        }
    
    };
    const handleSuggestTitle = async (selectedTitle) => {
        if (selectedTitle === "Suggest Title") {
            console.log('Description sent to API:', cardDescription); // Log the description before fetching suggestions

          try {
            const suggestedTitle = await fetchTitleSuggestions(cardDescription); // Use card description
            setSuggestedTitle(suggestedTitle);
            setShowSuggestions(true); // Optional: Show a visual indicator (like a checkmark)
          } catch (error) {
            console.error('Error fetching title suggestions:', error);
          }
        } else {
          // Handle other options from the select dropdown (optional)
          // For example, you could implement dejargonization here if selectedTitle is "dejargon"
        }
      };
    
    
      const fetchTitleSuggestions = async (description) => {
        try {
          const response = await fetch('http://localhost:8000/boardly/openapi/title', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch title suggestions');
          }
      
          const data = await response.json();
          return data.suggestedTitle;
        } catch (error) {
          throw error;
        }
      };
     
   
    return (
        <div>
            {/* Render cards within the card list */}
            {displayCards.map((card, cardIndex) => (
             <Flex key={cardIndex} justifyContent="center" alignItems="center" mt={3}>
                <Box className="card" p={3} bg="white" borderRadius="md">
                    <Flex direction="column" position="relative">
                        <Icon as={CloseIcon} w={3} h={3} color={'gray'} position="absolute" right={0} top={0} _hover={{color: 'red', transform: 'scale(1.2)'}} onClick={()=>handleDeleteCard(card.id)} />
                        
                        {/* Flex container for the title, edit icon */}
                        <Flex direction="column" alignItems="center">
                            <Flex direction="row" alignItems="center">
                                {editingCardId !== card.id ? (
                                    <>
                                        <Text fontSize={'xl'} color={'black'} mr={2} textAlign="center">{card.title}</Text>
                                        <Icon as={EditIcon} w={3} h={3} color={'gray'} _hover={{color: 'green', transform: 'scale(1.2)'}}
                                            onClick={() => { setEditingCardId(card.id); setEditingTitle(card.title); }} />
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            size="sm"
                                            autoFocus
                                            onBlur={() => handleEditTitle(card.id, editingTitle)}
                                            onKeyDown={(e) => { if(e.key === 'Enter') { handleEditTitle(card.id, editingTitle); }}}
                                        />
                                        <Icon as={CheckIcon} w={3} h={3} color={'green'} _hover={{color: 'blue', transform: 'scale(1.2)'}}
                                            onClick={() => handleEditTitle(card.id, editingTitle)} />
                                    </>
                                )}
                            </Flex>
                            <Select defaultValue="Select Option" size="sm" mt={2} borderColor="black" color="black" onChange={(e) => handleSuggestTitle(e.target.value)}>
    <option disabled value="Select Option">Select Option</option>
    <option value="Suggest Title">Suggest Title</option>
    <option value="dejargon">Dejargon</option>
</Select>




                        </Flex>
                        
                        <Text color={'gray'}>{card.description}</Text>
                    </Flex>
                </Box>
            </Flex>
            ))}
            {/* Display the suggested title in green text */}
            {suggestedTitle && (
                <Text color="green">{suggestedTitle}</Text>
            )}
        </div>
    );
};

export default Cards;
