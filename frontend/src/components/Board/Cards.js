import React, { useState, useEffect } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon, Textarea } from '@chakra-ui/react';

export const Cards = ({ myCardList }) => {
    // Access myObject here
    console.log(myCardList);
    const [displayCards, setDisplayCards] = useState([]);

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

    return (
        <div>
            {/* Render cards within the card list */}
            {displayCards.map((card, cardIndex) => (
                <Box key={cardIndex} className="card" p={3} mt={3} bg="white" borderRadius="md">
                    <Text>{card.title}</Text>
                    <Text>{card.description}</Text>
                </Box>
            ))}
        </div>
    );
};

export default Cards;