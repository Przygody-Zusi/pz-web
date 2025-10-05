import Image from "next/image";

interface VisualNovelDialogueProps {
  backgroundImage: string;
  dialogueText: string;
  dialogueBoxImage?: string;
  dialogueBoxMargin?: number;
  textMargin?: number;
  textSize?: number;
}

export default function VisualNovelDialogue({ 
  backgroundImage, 
  dialogueText,
  dialogueBoxImage = "/zusia/text_box.png",
  dialogueBoxMargin = 20,
  textMargin = 40,
  textSize = 1
}: VisualNovelDialogueProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Container that scales to fit smallest dimension */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative max-w-full max-h-full flex items-end justify-center">
          {/* Background Image - Contained */}
          <Image
            src={backgroundImage}
            alt="Background scene"
            width={600}
            height={400}
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
                width={600}
                height={100}
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