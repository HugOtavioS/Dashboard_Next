"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios";

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Database } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Dashboard() {
  
  const pecas = useRef([]);
  const [averageNew, setAverageNew] = useState(0);
  const taxa = useRef(0);
  const indexPecaMax = useRef(0);
  const [colorFilter, setColorFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [tamanhoFilter, setTamanhoFilter] = useState("all");
  const [date, setDate] = useState();

  // Usando refs para manter os valores atualizados
  const prevCountRef = useRef(0);
  const cumulativeNewRef = useRef(0);
  const callsCountRef = useRef(0);

  const [chartData, setChartData] = useState([
    { color: "Azul", quantidade: 0, fill: "#344BFD" },
    { color: "Verde", quantidade: 0, fill: "#2BC84D" },
    { color: "Vermelho", quantidade: 0, fill: "#B10300" },
    { color: "Amarelo", quantidade: 0, fill: "#FFCC00" },
  ]);
  const [chartConfig, setChartConfig] = useState({
    quantidade: {
      label: "Quantidade",
    },
    Azul: {
      label: "Azul",
      color: "hsl(var(--chart-1))",
    },
    Verde: {
      label: "Verde",
      color: "hsl(var(--chart-2))",
    },
    Vermelho: {
      label: "Vermelho",
      color: "hsl(var(--chart-3))",
    },
    Amarelo: {
      label: "Amarelo",
      color: "hsl(var(--chart-4))",
    },
  });

  // Refs para estatísticas por cor
  const prevCountColorRef = useRef({
    azul: 0,
    verde: 0,
    vermelho: 0,
    amarelo: 0,
  });
  const cumulativeNewColorRef = useRef({
    azul: 0,
    verde: 0,
    vermelho: 0,
    amarelo: 0,
  });
  const callsCountColorRef = useRef({
    azul: 0,
    verde: 0,
    vermelho: 0,
    amarelo: 0,
  });
  const [averageNewColor, setAverageNewColor] = useState({
    azul: 0,
    verde: 0,
    vermelho: 0,
    amarelo: 0,
  });

  useEffect(() => {
    taxa.current = 5;
  }, []);

  // Função para adicionar um contato (dados de exemplo)
  const addPeca = async () => {
    try {
      const newpeca = {
        id_Cor: Math.floor(Math.random() * 4) + 1,
        id_Tamanho: Math.floor(Math.random() * 3) + 1,
        id_Material: Math.floor(Math.random() * 2) + 1,
        Data_hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      const response = await axios.post("http://localhost:8080?addpeca", newpeca, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        withCredentials: false
      });
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
    }
  };

  // Função para buscar os contatos
  const getPecas = async () => {
      try {
        const response = await fetch("http://localhost:8080?getpecas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar contatos");
        }

        const data = await response.json();
        pecas.current = data;
        // Chama a função de cálculo das estatísticas passando o total atual de registros
        calculateStatistics(data.length);
        calculateStatisticsByColor(data);
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
      }
  };

  const firstGetPecas = async () => {
    try {
      const response = await fetch("http://localhost:8080?getpecas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar contatos");
      }

      const data = await response.json();

      prevCountRef.current = data.length;
      prevCountColorRef.current = {
        azul: data.filter(c => c.cor === "azul").length,
        verde: data.filter(c => c.cor === "verde").length,
        vermelho: data.filter(c => c.cor === "vermelho").length,
        amarelo: data.filter(c => c.cor === "amarelo").length,
      };
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    }
  };

  // Função para calcular estatísticas de novos registros e média utilizando refs
  const calculateStatistics = (currentCount) => {
      // Calcula quantos registros foram adicionados nesta chamada
      const newRecords = currentCount - prevCountRef.current > 0 ? currentCount - prevCountRef.current : 0;
      
      // Atualiza os valores usando refs
      callsCountRef.current += taxa.current;
      cumulativeNewRef.current += newRecords;
      const newAverage = cumulativeNewRef.current / callsCountRef.current;

      setAverageNew(newAverage);
      prevCountRef.current = currentCount;
  };

  // Função para calcular estatísticas por cor
  const calculateStatisticsByColor = (pecasList) => {
    const colors = ["azul", "verde", "vermelho", "amarelo"];
    const newAverages = {};

    colors.forEach((cor) => {
      const currentCount = pecasList.filter(c => c.cor === cor).length;
      const prevCount = prevCountColorRef.current[cor];
      const newRecords = currentCount - prevCount > 0 ? currentCount - prevCount : 0;

      callsCountColorRef.current[cor] += taxa.current;
      cumulativeNewColorRef.current[cor] += newRecords;
      newAverages[cor] = cumulativeNewColorRef.current[cor] / callsCountColorRef.current[cor];

      prevCountColorRef.current[cor] = currentCount;
    });

    setAverageNewColor(newAverages);
  };

  const getMaxQtdPecas = () => {
    const colors = ["azul", "verde", "vermelho", "amarelo"];
    let maxColor = null;
    let maxCount = -1;
    let maxIndex = -1;

    colors.forEach((color, idx) => {
      const count = pecas.current.filter(peca => peca.cor === color && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length;
      if (count > maxCount) {
        maxCount = count;
        maxColor = color;
        maxIndex = idx;
      }
    });

    indexPecaMax.current = maxIndex;
    return maxColor;
  }

  const updateChartData = () => {
    let dateFilter = date ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}` : null;
    
    setChartData([
      { color: "Azul", quantidade: pecas.current.filter(peca => peca.cor === "azul" && (dateFilter == null || `${peca.data_hora}`.split(" ")[0] === dateFilter)).length, fill: "#344BFD" },
      { color: "Verde", quantidade: pecas.current.filter(peca => peca.cor === "verde" && (dateFilter == null || `${peca.data_hora}`.split(" ")[0] === dateFilter)).length, fill: "#2BC84D" },
      { color: "Vermelho", quantidade: pecas.current.filter(peca => peca.cor === "vermelho" && (dateFilter == null || `${peca.data_hora}`.split(" ")[0] === dateFilter)).length, fill: "#B10300" },
      { color: "Amarelo", quantidade: pecas.current.filter(peca => peca.cor === "amarelo" && (dateFilter == null || `${peca.data_hora}`.split(" ")[0] === dateFilter)).length, fill: "#FFCC00" },
    ]);
  };

  // Intervalo para adicionar um contato a cada 0.5 segundos
//   useEffect(() => {
//     firstGetPecas();
//     getPecas();

//     const addInterval = setInterval(async() => {
//       await addPeca();
//       await getMaxQtdPecas();
//       await getPecas();
//       updateChartData();
//     }, `${taxa.current * 1000}`);

//     return () => clearInterval(addInterval);
//   }, [date]);

  // useEffect(() => {

  //   const addInterval = setInterval(async() => {
  //     await addPeca();
  //   }, 1000);

  //   return () => clearInterval(addInterval);
  // }, [date]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-blue-600 hover:text-blue-700" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-gray-300" />
              <h1 className="text-xl font-medium text-blue-600">Dashboard</h1>
            </div>
          </header>
          
          <main className="w-full h-full py-12 px-12">

          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
