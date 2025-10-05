import Image from 'next/image';
import { useState } from 'react';

// Main component - exported as default
export default function VisualNovelDialogue({ 
  backgroundImage, 
  dialogueText,
  dialogueBoxImage = "/zusia/text_box.png",
  dialogueBoxMargin = 20,
  textMargin = 40,
  textSize = 1
}:
{ 
  backgroundImage: string; 
  dialogueText: string;
  dialogueBoxImage?: string;
  dialogueBoxMargin?: number; // Margin from sides for dialogue box
  textMargin?: number; // Padding inside dialogue box for text
  textSize?: number; // Font size in vw units
}) {
  // State to manage image loading (if needed in future)
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Container that scales to fit smallest dimension */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative max-w-full h-full flex items-end justify-center">
          {/* Background Image - Contained */}
          <Image
            src={backgroundImage}
            alt="Background scene"
            height={400}
            width={600}
            className="max-w-full max-h-full object-contain block"
          />
          
          {/* Dialogue Box Section - Overlapping at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0"
            style={{ padding: `0 ${dialogueBoxMargin}px` }}
          >
            <div className="relative w-full">
              {/* Dialogue Box Image - Stretches Horizontally */}
              <Image
                src={dialogueBoxImage}
                alt="Dialogue box"
                className="w-full h-auto block"
                height={200}
                width={600}
              />
              
              {/* Text Overlay */}
              <div 
                className="absolute inset-0 flex items-center text-white "
                style={{ 
                  padding: `${textMargin}px`,
                  fontSize: `${textSize}vw`
                }}
              >
                <p className="leading-relaxed">
                  {dialogueText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}