'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, ArrowLeft, Baby, Activity, Calculator, FileText, AlertTriangle, MessageCircle } from 'lucide-react'

const DRUGS = [
  {
    id: 1,
    name: 'Amoxicillin',
    nameAr: 'أموكسيسيلين',
    dosePerKg: 50,
    unit: 'mg',
    factor: 1,
    methodIndex: 1,
    timeMultiplier: 1
  },
  {
    id: 2,
    name: 'Gentamicin',
    nameAr: 'جنتاميسين',
    dosePerKg: 5,
    unit: 'mg',
    factor: 12.5,
    methodIndex: 2,
    timeMultiplier: 1
  },
  {
    id: 3,
    name: 'Caffeine Loading',
    nameAr: 'كافيين تحميلي',
    dosePerKg: 20,
    unit: 'mg',
    factor: 2,
    methodIndex: 3,
    timeMultiplier: 1
  },
  {
    id: 4,
    name: 'Caffeine Maintenance',
    nameAr: 'كافيين صيانة',
    dosePerKg: 10,
    unit: 'mg',
    factor: 50,
    methodIndex: 4,
    timeMultiplier: 1
  },
  {
    id: 5,
    name: 'Colistin Loading',
    nameAr: 'كوليستين تحميلي',
    dosePerKg: 150,
    unit: 'IU',
    factor: 30,
    methodIndex: 5,
    timeMultiplier: 1
  },
  {
    id: 6,
    name: 'Colistin Maintenance',
    nameAr: 'كوليستين صيانة',
    dosePerKg: 37.5,
    unit: 'IU',
    factor: 7.5,
    methodIndex: 6,
    timeMultiplier: 1
  },
  {
    id: 7,
    name: 'Tigecycline',
    nameAr: 'تيجيسايكلين',
    dosePerKg: 2,
    unit: 'mg',
    factor: 2,
    methodIndex: 7,
    timeMultiplier: 1
  },
  {
    id: 8,
    name: 'Meropenem',
    nameAr: 'ميروبينيم',
    dosePerKg: 40,
    unit: 'mg',
    factor: 1.6,
    methodIndex: 8,
    timeMultiplier: 1
  },
  {
    id: 9,
    name: 'Dopamine',
    nameAr: 'دوبامين',
    dosePerKg: 5,
    unit: 'mcg',
    factor: 36,
    methodIndex: 9,
    timeMultiplier: 1440
  },
  {
    id: 10,
    name: 'Dexmedetomidine',
    nameAr: 'ديكسميدتوميدين',
    dosePerKg: 0.3,
    unit: 'mcg',
    factor: 14.4,
    methodIndex: 10,
    timeMultiplier: 24
  }
]

const ADMINISTRATION_METHODS: Record<number, string> = {
  1: 'تسحب ** مل وتعطى خلال ٥ دقائق',
  2: 'تسحب ** وحدة انسولين وتخفف ب٥ سيسي كلوكوز وتر ويعطى خلال ١٠ دقائق',
  3: 'تسحب ** مل وتضاف الى ## سيسي كلوكوز وتر، تفرغ ١٠ سيسي ويعطى ١٠ سيسي',
  4: 'تسحب ** وحدة انسولين وتخفف ب٥ سيسي كلوكوز وتر ويعطى خلال ١٠ دقائق',
  5: 'تسحب ** وحدة انسولين وتخفف ب٥ سيسي كلوكوز وتر ويعطى خلال ٥ دقائق',
  6: 'تسحب ** وحدة انسولين وتخفف ب٥ سيسي كلوكوز وتر ويعطى خلال ٥ دقائق',
  7: 'تسحب ** وتضاف الى ## سيسي كلوكوز وتر، تفرغ ١٠ سيسي ويعطى ١٠ سيسي',
  8: 'تسحب ** وتضاف الى ## سيسي كلوكوز وتر، تفرغ ١٠ سيسي ويعطى ١٠ سيسي',
  9: 'تسحب ** وحدة انسولين وتضاف الى 20 سيسي كلوكوز وتر، تفرغ ١٠ سيسي ويعطى ١٠ سيسي',
  10: 'تسحب ** وحدة انسولين وتضاف الى 20 سيسي كلوكوز وتر، تفرغ ١٠ سيسي ويعطى ١٠ سيسي'
}

const normalizeArabicNumerals = (value: string): string => {
  const trimmedValue = value.trim()
  const arabicToEnglishMap: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  }
  return trimmedValue.replace(/[٠-٩]/g, (match) => arabicToEnglishMap[match] || match)
}

const formatNumber = (value: number, decimals: number = 1): string => {
  const isWholeNumber = value === Math.round(value)
  return isWholeNumber ? value.toFixed(0) : value.toFixed(decimals)
}

const formatDrugRule = (drug: typeof DRUGS[0]): string => {
  if (drug.unit === 'IU' && (drug.id === 5 || drug.id === 6)) {
    const roundedDose = Math.round(drug.dosePerKg)
    return `${roundedDose.toLocaleString('en-US')},000 IU/kg/dose`
  }
  return `${drug.dosePerKg} ${drug.unit}/kg${drug.timeMultiplier > 1 ? `/${drug.timeMultiplier === 1440 ? 'min' : 'hr'}` : ''}/dose`
}

interface DrugResult {
  drug: typeof DRUGS[0]
  totalDose: number
  displayDose: number | string
  displayUnit: string
  volumeToDraw: number
  dilutionVolume: number | null
  method: string
}

export default function Home() {
  const [babyName, setBabyName] = useState('')
  const [babyWeight, setBabyWeight] = useState('')
  const [error, setError] = useState('')
  const [currentScreen, setCurrentScreen] = useState<'greeting' | 'drugSelection' | 'results'>('greeting')
  const [selectedDrugs, setSelectedDrugs] = useState<number[]>([])
  const [patientInfo, setPatientInfo] = useState<{ name: string; weight: number } | null>(null)
  const [calculationResults, setCalculationResults] = useState<DrugResult[]>([])

  const handleSelectTreatment = () => {
    const normalizedWeight = normalizeArabicNumerals(babyWeight)
    if (!normalizedWeight || normalizedWeight.trim() === '') {
      setError('الرجاء إدخال وزن الطفل')
      return
    }
    const weightAsNumber = parseFloat(normalizedWeight)
    if (isNaN(weightAsNumber) || weightAsNumber <= 0) {
      setError('الرجاء إدخال وزن صحيح')
      return
    }
    setError('')
    setPatientInfo({ name: babyName.trim(), weight: weightAsNumber })
    console.log('NICU Dose Calculator - Patient Info:', { babyName: babyName.trim(), babyWeight: weightAsNumber })
    setCurrentScreen('drugSelection')
  }

  const handleDrugToggle = (drugId: number) => {
    setSelectedDrugs((prev) => prev.includes(drugId) ? prev.filter((id) => id !== drugId) : [...prev, drugId])
  }

  const handleCalculateDoses = () => {
    if (selectedDrugs.length === 0 || !patientInfo) return
    const results: DrugResult[] = []
    selectedDrugs.forEach(drugId => {
      const drug = DRUGS.find(d => d.id === drugId)
      if (!drug) return
      let totalDose = patientInfo.weight * drug.dosePerKg * drug.timeMultiplier
      let displayDose = totalDose
      let displayUnit = drug.unit
      if (drug.unit === 'IU') {
        displayDose = Math.round(totalDose * 1000) + ",000"
        displayUnit = 'IU'
      } else if (drug.unit === 'mcg' && totalDose > 1000) {
        displayDose = totalDose / 1000
        displayUnit = 'mg'
      }
      const volumeToDraw = Math.round((patientInfo.weight * drug.factor) * 10) / 10
      const methodTemplate = ADMINISTRATION_METHODS[drug.methodIndex]
      const hasDilution = methodTemplate.includes('##')
      const dilutionVolume = hasDilution ? 20 - volumeToDraw : null
      let method = methodTemplate.replace(/\*\*/g, formatNumber(volumeToDraw, 1))
      if (hasDilution && dilutionVolume !== null) {
        method = method.replace(/##/g, formatNumber(dilutionVolume, 1))
      }
      results.push({ drug, totalDose, displayDose, displayUnit, volumeToDraw, dilutionVolume, method })
    })
    setCalculationResults(results)
    setCurrentScreen('results')
  }

  const handleBackToDrugSelection = () => setCurrentScreen('drugSelection')
  const handleBackToGreeting = () => { setCurrentScreen('greeting'); setSelectedDrugs([]); setCalculationResults([]); setPatientInfo(null) }
  const handleStartOver = () => { setCurrentScreen('greeting'); setBabyName(''); setBabyWeight(''); setSelectedDrugs([]); setCalculationResults([]); setPatientInfo(null) }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50" dir="rtl">
      <header className="bg-gradient-to-l from-sky-500 to-teal-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {currentScreen !== 'greeting' && (
                <Button variant="ghost" size="icon" onClick={currentScreen === 'results' ? handleBackToDrugSelection : handleBackToGreeting} className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              )}
            </div>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">حاسبة الجرع</h1>
              <p className="text-sky-100 text-sm md:text-base">للوحدات الخاصة برعاية حديثي الولادة</p>
            </div>
            <div className="flex-1 flex justify-end">
              {(currentScreen === 'drugSelection' || currentScreen === 'results') && patientInfo && (
                <div className="bg-white/20 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  <div className="text-sm">
                    <div className="font-semibold">{patientInfo.name || 'مجهول'}</div>
                    <div className="text-sky-100">{patientInfo.weight} كجم</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className={`transition-all duration-500 ease-in-out ${currentScreen === 'greeting' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <Card className="shadow-2xl border-sky-200">
                <CardHeader className="bg-gradient-to-l from-sky-50 to-teal-50 border-b border-sky-200">
                  <CardTitle className="text-2xl text-sky-800 text-center">معلومات المريض</CardTitle>
                  <CardDescription className="text-center text-sky-700">أدخل بيانات الطفل للبدء في حساب الجرعات</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="babyName" className="text-sky-800 text-base font-semibold">اسم الطفل</Label>
                    <Input id="babyName" type="text" placeholder="أدخل اسم الطفل" value={babyName} onChange={(e) => setBabyName(e.target.value)} className="text-lg border-sky-300 focus:border-sky-500 focus:ring-sky-500 text-right" dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="babyWeight" className="text-sky-800 text-base font-semibold">وزن الطفل بالكيلوغرام</Label>
                    <Input id="babyWeight" type="text" step="0.01" min="0" placeholder="مثال: 1.25 أو ٢.٥" value={babyWeight} onChange={(e) => {
                      const normalizedValue = normalizeArabicNumerals(e.target.value)
                      setBabyWeight(normalizedValue)
                      if (error && normalizedValue.trim() !== '') { setError('') }
                    }} className="text-lg border-sky-300 focus:border-sky-500 focus:ring-sky-500 text-right" dir="rtl" />
                    <p className="text-sm text-sky-600">يجب إدخال الوزن بالكيلوغرام (يدعم الكسور العشرية والأرقام العربية)</p>
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>
                  )}
                  <Button onClick={handleSelectTreatment} className="w-full bg-gradient-to-l from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-lg font-bold py-6 shadow-lg transition-all duration-200 hover:shadow-xl">
                    اختيار العلاج
                  </Button>
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                    <p className="text-sm text-sky-700 text-center">💡 يتم احتساب الجرعات بدقة عالية لضمان سلامة المرضى</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${currentScreen === 'drugSelection' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
          <div className="container mx-auto max-w-4xl">
            <Card className="mb-6 bg-gradient-to-l from-sky-100 to-teal-100 border-sky-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-l from-sky-500 to-teal-500 rounded-full p-3"><Baby className="h-8 w-8" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-sky-800 mb-1">{patientInfo?.name || 'مجهول'}</h2>
                      <p className="text-sky-700">الوزن: <span className="font-bold">{patientInfo?.weight}</span> كجم</p>
                    </div>
                  </div>
                  <div className="bg-white/50 rounded-full px-3 py-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-sky-700" />
                    <span className="text-sm text-sky-700">{selectedDrugs.length} دواء محدد</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-sky-800 mb-2">اختر الأدوية</h2>
              <p className="text-sky-700">حدد واحد أو أكثر من الأدوية التالية لحساب الجرعات</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
              {DRUGS.map((drug) => {
                const isSelected = selectedDrugs.includes(drug.id)
                return (
                  <button key={drug.id} onClick={() => handleDrugToggle(drug.id)} className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isSelected ? 'bg-gradient-to-l from-sky-500 to-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white border-sky-200 hover:border-sky-400 text-sky-800'}`}>
                    {isSelected && (
                      <div className="absolute top-3 left-3 bg-white/20 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="text-left" dir="ltr">
                      <h3 className="text-xl font-bold mb-2">{drug.name}</h3>
                      <p className={`text-sm font-semibold ${isSelected ? 'text-white/90' : 'text-sky-600'}`}>{formatDrugRule(drug)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${currentScreen === 'results' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
          <div className="container mx-auto max-w-5xl">
            <Card className="mb-6 bg-gradient-to-l from-emerald-500 to-teal-600 border-emerald-600">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3"><Calculator className="h-8 w-8 text-emerald-600" /></div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">نتائج الحساب</h2>
                      <p className="text-emerald-100">{patientInfo?.name} - {patientInfo?.weight} كجم - {calculationResults.length} دواء</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full max-w-xs">
                    <Button onClick={handleStartOver} variant="outline" className="w-full bg-white/20 border-white text-white font-bold hover:bg-white/30 hover:text-white px-4 py-3">
                      <FileText className="h-8 w-8 mr-2" />
                      بدء جديد
                    </Button>
                    <a href="https://t.me/NICU_BTHbot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/20 border border-white text-white font-bold hover:bg-white/30 hover:text-white rounded-lg shadow transition-all duration-200 hover:shadow-lg">
                      <MessageCircle className="h-8 w-8 mr-2" />
                      التواصل مع فريق الصيادلة
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
              {calculationResults.map((result, index) => (
                <Card key={result.drug.id} className="shadow-lg border-emerald-200">
                  <CardHeader className="bg-gradient-to-l from-emerald-50 to-teal-50 border-b border-emerald-200">
                    <div className="flex items-center gap-3" dir="ltr">
                      <div className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <CardTitle className="text-3xl text-emerald-800 font-black mb-1">{result.drug.name}</CardTitle>
                        <CardDescription className="text-emerald-700 text-base">{formatDrugRule(result.drug)}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="bg-gradient-to-l from-emerald-100 to-teal-100 rounded-lg p-4">
                      <p className="text-sm text-emerald-700 mb-1">الجرعة الكلية</p>
                      <p className="text-3xl font-bold text-emerald-900">
                        {typeof result.displayDose === 'string' ? result.displayDose : formatNumber(result.displayDose, 1)} {result.displayUnit}
                      </p>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4" dir="rtl">
                      <p className="text-sm text-emerald-700 mb-2 font-semibold">طريقة الإعطاء</p>
                      <p className="text-base text-sky-800 leading-relaxed">{result.method}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 mb-8 bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3" dir="rtl">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 font-bold text-lg italic mb-1">الرجاء التاكد جيداً من الوزن والجرع المحسوبة قبل اعطاء العلاج</p>
                  <p className="text-amber-700 text-sm">⚠️ احرص دائماً على مراجعة الحسابات والتأكد من صحة البيانات قبل إعطاء أي دواء</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentScreen === 'drugSelection' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-200 p-4 shadow-lg">
            <div className="container mx-auto max-w-4xl">
              <Button onClick={handleCalculateDoses} disabled={selectedDrugs.length === 0} className="w-full py-6 text-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                حساب الجرع
                {selectedDrugs.length > 0 && (
                  <span className="mr-2 bg-white/20 px-3 py-1 rounded-full">{selectedDrugs.length}</span>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentScreen === 'greeting' && (
          <footer className="bg-white border-t border-sky-200 py-4 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sky-700 text-sm">حاسبة الجرع للوحدات الخاصة برعاية حديثي الولادة - NICU Dose Calculator</p>
              <p className="text-sky-500 text-xs mt-1">تم تصميم هذا التطبيق للمساعدة فقط - يرجى دائماً مراجعة الطبيب المعالج</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}
