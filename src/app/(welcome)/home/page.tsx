'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import VisualNovelDialogue from '@/components/ui/zusia_dialogue';

export default function FormPage() {
  const router = useRouter();
  
  // CONFIGURATION - Change these values easily
  const [currentImage, setCurrentImage] = useState('image1');
  const [imageText, setImageText] = useState('Witaj!');
  
  // Available images (add your own paths)
  const images = {
    image1: 'zusia/default.png',
    image2: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
    image3: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800'
  };
  
  // Button configuration with predefined text
  const buttons = [
    { 
      id: 1, 
      label: 'Student/Uczeń', 
      text: 'Jestem studentem/uczniem, mam XX lat, chciałbym na starość pobierać XXXX zł emerytury' 
    },
    { 
      id: 2, 
      label: 'Pracownik', 
      text: 'Pracuję jako XXXX w firmie XXX od X lat, zarabiam XXXX miesięcznie, mam XX lat, chciałbym żyć komfortowo z XXXX zł emerytury' 
    },
    { 
      id: 3, 
      label: 'Właściciel biznesu/freelancer', 
      text: 'Jestem właściciel biznesu/freelancerem w biznesie XXX od X lat, zarabiam XXXX miesięcznie, mam XX lat, chciałbym żyć komfortowo z XXXX zł emerytury' 
    },
    { 
      id: 4, 
      label: 'Emeryt', 
      text: 'Jestem emerytem.' 
    },
    { 
      id: 5, 
      label: 'Bezrobotny',
      text: 'Jestem aktualnie bezrobotny.' 
    },
    { 
      id: 6, 
      label: 'Inny', 
      text: 'Chciabym przeżyć na emeryturze' 
    }
  ];
  
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedButton, setSelectedButton] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Handle button click - insert predefined text
  const handleButtonClick = (btn) => {
    setSelectedButton(btn.id);
    setTextareaValue(btn.text);
  };
  
  const handleSubmit = async () => {
    // Validate
    if (!textareaValue.trim()) {
      alert('Proszę wpisać odpowiedź');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send only textarea text to server
      const response = await fetch('http://localhost:8000/api/LLM/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "prompt": textareaValue
        })
      });
      
      if (response.ok) {
        // Wait for JSON response
        const jsonData = await response.json();
        console.log('Received from server:', jsonData);
        
        // Store in localStorage to pass to dashboard
        localStorage.setItem('dashboardData', JSON.stringify(jsonData));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        alert('Błąd wysyłania');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd połączenia z serwerem');
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* LEFT SIDE - 66% */}
      <div className="w-2/3 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col">
        
        {/* Header with background */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Kim jesteś?
          </h1>
        </div>
        
        {/* Button Grid - 3x2 */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {buttons.map((btn) => (
              <Button
                key={btn.id}
                onClick={() => handleButtonClick(btn)}
                disabled={loading}
                variant={selectedButton === btn.id ? "default" : "outline"}
                className={`h-20 text-lg font-medium ${
                  selectedButton === btn.id 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white'
                }`}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Textarea and Submit */}
        <div className="flex-1 flex flex-col">
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            disabled={loading}
            placeholder="Wpisz swoją odpowiedź tutaj lub wybierz jedną z opcji powyżej..."
            className="flex-1 text-4xl mb-4 bg-white/80 backdrop-blur-sm text-lg resize-none"
          />
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            {loading ? 'Wysyłanie...' : 'Wyślij'}
          </Button>
        </div>
      </div>
      
      {/* RIGHT SIDE - 33% */}
      <div className="w-1/3 relative">
        {/* Zusia Image */}
        <VisualNovelDialogue
        backgroundImage="/zusia/default.png"
        dialogueText="Dialogue test"/>
        
        {/* Image Switcher (for demo - remove in production) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Object.keys(images).map((key) => (
            <button
              key={key}
              onClick={() => setCurrentImage(key)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentImage === key 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}