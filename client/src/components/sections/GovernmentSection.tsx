import type React from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Official {
  id: string
  name: string
  position: string
  description: string
  whatsappNumber: string
  img: string
}

const officials: Official[] = [
  {
    id: "1",
    name: "ADIO JAMES IYANUONLUWA",
    position: "President",
    description: "Leading the student body and overseeing all executive activities.",
    whatsappNumber: "+234 813 312 7332",
    img: "adio_james.jpg"
  },
  {
    id: "2",
    name: "ADELEGAN RAPHEL BABATUNDE",
    position: "Vice President",
    description: "Supporting the president and coordinating executive functions.",
    whatsappNumber: "+234 904 807 9968",
    img: "adelegan_raphel.jpg"
  },
  {
    id: "3",
    name: "ALAO AYORINDE SAMUEL",
    position: "General Secretary",
    description: "Managing official correspondence and maintaining records.",
    whatsappNumber: "+234 704 514 2118",
    img: "alao_ayorinde.jpg"
  },
  {
    id: "4",
    name: "OLAYINKA BUKOLA SOFIAT",
    position: "Assistant General Secretary",
    description: "Assisting with secretarial duties and documentation.",
    whatsappNumber: "+234 906 939 0953",
    img: "olayinka_bukola.jpg"
  },
  {
    id: "5",
    name: "RAJI TAIWO OLUWATOSIN",
    position: "Financial Secretary",
    description: "Managing financial records and transactions.",
    whatsappNumber: "+234 811 735 0408",
    img: "raji_taiwo.jpg"
  },
  {
    id: "6",
    name: "KELANI DAVIES OLALEKAN",
    position: "Treasurer",
    description: "Overseeing financial planning and budget management.",
    whatsappNumber: "+234 906 957 2528",
    img: "kelani_davies.jpg"
  },
  {
    id: "7",
    name: "ABIOLA DAVID TOLUWANIMI",
    position: "Public Relations Officer",
    description: "Managing public communications and media relations.",
    whatsappNumber: "+234 916 461 3487",
    img: "abiola_david.jpg"
  },
  {
    id: "8",
    name: "AROGUNDADE HABEEBAH OLOLADE",
    position: "Welfare Director",
    description: "Ensuring student wellbeing and addressing welfare concerns.",
    whatsappNumber: "+234 810 012 4117",
    img: "arogundade_habeebah.jpg"
  },
  {
    id: "9",
    name: "ODIMGBE DESMOND",
    position: "Social Director",
    description: "Organizing social events and community activities.",
    whatsappNumber: "+234 703 702 2750",
    img: "odimgbe_desmond.jpg"
  },
  {
    id: "10",
    name: "RAHEEM BOLUWATIFE STEPHEN",
    position: "Sports Director",
    description: "Coordinating sports activities and athletic programs.",
    whatsappNumber: "+234 810 537 3607",
    img: "raheem_boluwatife.jpg"
  },
  {
    id: "11",
    name: "AKINODE ADELEKE MUSA",
    position: "Director of Transport",
    description: "Managing transportation services and logistics.",
    whatsappNumber: "+234 815 962 6025",
    img: "akinode_adeleke.jpg"
  }
]

export const GovernmentSection: React.FC = () => {
  const handleWhatsAppMessage = (phoneNumber: string, name: string, _position: string) => {
    const message = encodeURIComponent(
      `Hello ${name}, I would like to reach out to you regarding student union matters. I found your contact through the FUOYE Student Union Anonymous Messaging platform.`,
    )
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Meet Your Student Government
          </h2>
          <p className="text-lg text-muted-foreground">
            Get to know the dedicated officials working for your interests and welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {officials.map((official, index) => {

            return (
              <Card
                key={official.id}
                className={cn(
                  "text-center border-0 shadow-lg card-hover animate-in",
                  "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
                  "hover:shadow-xl transition-all duration-300",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto h-20 w-20 rounded-full mb-4">
                    <img src={`/images/${official.img}`} alt={`${official.name} image`} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{official.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">{official.position}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{official.description}</p>

                  <Button
                    onClick={() => handleWhatsAppMessage(official.whatsappNumber, official.name, official.position)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary mb-2">Need to reach someone specific?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You can contact any of our officials directly via WhatsApp for immediate assistance, or use our anonymous
              messaging system if you prefer to remain anonymous.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
