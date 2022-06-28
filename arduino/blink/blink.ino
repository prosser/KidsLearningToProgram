
// start paste here
int greenLED = 32;

// use Farnsworth timing!
const int WPM = 15; // words per minute

// milliseconds per word
const int MILLISECONDS_PER_WORD = 60000 / WPM;

// Use PARIS as the canonical word (it has 50 time units w/ dits and dahs)
const int DITS_PER_WORD = 50;

// milliseconds per dit
int DIT = MILLISECONDS_PER_WORD / DITS_PER_WORD;
int DAH = DIT * 3;

int INTRA_CHARACTER_DELAY = DIT;
int INTER_CHARACTER_DELAY = DIT * 3;
int INTER_WORD_DELAY = DIT * 7;

// see https://www.circuitbasics.com/how-to-control-leds-on-the-arduino/
void light(int pin, bool isOn, int duration)
{
  if (isOn)
  {
    digitalWrite(pin, HIGH);
  }
  else
  {
    digitalWrite(pin, LOW);
  }
  delay(duration);
}

int *createMorseLetter(const char *code)
{
  int len = strlen(code);
  int *array = (int *)malloc(len * sizeof(int) + sizeof(int)); // create an array of size + 1
  int *ptr = array;

  for (int i = 0; i < len; i++)
  {
    switch (code[i])
    {
    case '-':
      *ptr = DAH;
      break;
    case '.':
      *ptr = DIT;
      break;
    default:
      *ptr = INTER_WORD_DELAY;
      break;
    }

    ptr++;
  }

  *ptr = 0;

  return array;
}

// don't forget to call free() on the variable that this returns!
const char *getMorseCode(char letter)
{
  int *array = NULL;

  letter = tolower(letter);
  switch (letter)
  {
  case ' ':
    return " ";
  case 'a':
    return ".-";
  case 'b':
    return "-...";
  case 'c':
    return "-.-.";
  case 'd':
    return "-..";
  case 'e':
    return ".";
  case 'f':
    return "..-.";
  case 'g':
    return "--.";
  case 'h':
    return "....";
  case 'i':
    return "..";
  case 'j':
    return ".---";
  case 'k':
    return "-.-";
  case 'l':
    return ".-..";
  case 'm':
    return "--";
  case 'n':
    return "-.";
  case 'o':
    return "---";
  case 'p':
    return ".--.";
  case 'q':
    return "--.-";
  case 'r':
    return ".-.";
  case 's':
    return "...";
  case 't':
    return "-";
  case 'u':
    return "..-";
  case 'v':
    return "...-";
  case 'w':
    return ".--";
  case 'x':
    return "-..-";
  case 'y':
    return "-.--";
  case 'z':
    return "--..";
  case '1':
    return ".----";
  case '2':
    return "..---";
  case '3':
    return "...--";
  case '4':
    return "....-";
  case '5':
    return ".....";
  case '6':
    return "-....";
  case '7':
    return "--...";
  case '8':
    return "---..";
  case '9':
    return "----.";
  case '0':
    return "-----";
  default:
    return " ";
  }
}

void sendMorseCode(int pin, const char *text)
{
  int textLength = strlen(text);
  for (int iText = 0; iText < textLength; iText++)
  {
    const char *code = getMorseCode(text[iText]);
    int codeLength = strlen(code);

    for (int iCode = 0; iCode < codeLength; iCode++)
    {
      // light up the LED for either a . or a -based on whatever the code says
      char c = code[iCode];

      switch (c)
      {
      case ' ':
        light(pin, false, INTER_WORD_DELAY);
        break;

      case '-':
        light(pin, true, DAH);
        if (iCode < codeLength - 1)
          light(pin, false, INTRA_CHARACTER_DELAY);
        break;

      case '.':
        light(pin, true, DIT);
        if (iCode < codeLength - 1)
          light(pin, false, INTRA_CHARACTER_DELAY);
        break;
      }
    }

    if (iText < textLength - 1)
    {
      // if we're not on the last letter of the text, keep the light off a little longer (the inter-letter delay)
      light(pin, false, INTER_CHARACTER_DELAY);
    }
  }
  light(pin, false, 0);
}

void setup()
{
  pinMode(greenLED, OUTPUT);
}

void loop()
{
  // write the code to call light(pin, isOn, duration) for what we want -{zach was here}
  // for example: light(greenLED, true, 500); to turn the light on for 500ms

  // SOS = short short short, long long long, short short short, pause for one second
  sendMorseCode(greenLED, "Talking away I dont know what Im to say Ill say it anyway Today is another day to find you Saying away Ill be coming for your love OK Take on me take on me Take me on take on me Ill be gone In a day or two So needless to say Of odds and ends But Ill be stumbling away Slowly learning that life is 1O Say after me Its no better to be safe than sorry Take on me take on me Take me on take on me Ill be gone In a day or two oh things that you say Yeah Is it life or just to lay my worries away Youre all the things Ive got to remember Youre shying away Ill be coming for you anyway Take on me take on me Take me on take on me Ill be gone In a day Take on me take on me Take me on take on me Ill be gone In a day Take on me take on me Take me on take on me");

  //sendMorseCode(greenLED, "SOS  ");
  delay(10 * 1000); // delay 10 seconds

  // light(greenLED, true, 100);
  // light(greenLED, false, 500);
  // light(greenLED, true, 300);
  // light(greenLED, false, 500);
  // light(greenLED, true, 100);
  // light(greenLED, false, 500);
}