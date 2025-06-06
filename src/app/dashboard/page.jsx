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
  useEffect(() => {
    firstGetPecas();
    getPecas();

    const addInterval = setInterval(async() => {
      await addPeca();
      await getMaxQtdPecas();
      await getPecas();
      updateChartData();
    }, `${taxa.current * 1000}`);

    return () => clearInterval(addInterval);
  }, [date]);

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
            <div className="chart-1 flex flex-col gap-16 justify-center w-full h-max">
              <div className="flex justify-center gap-8 w-full">
                <Card className="flex justify-center gap-4 w-full">
                  <CardContent className="relative flex items-center text-[16px] font-semibold text-center bg-[#4D648D] py-8 rounded-lg text-white p-5">
                    <div className="flex justify-center gap-3 w-full">
                      <div className="flex gap-1 justify-between items-center w-full">
                        <h3>Cor: </h3>
                        <Select onValueChange={setColorFilter} defaultValue="all">
                          <SelectTrigger className="border-black w-[180px] bg-white text-black">
                            <SelectValue placeholder="Filtro de cor" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="blue">Azul</SelectItem>
                            <SelectItem value="green">Verde</SelectItem>
                            <SelectItem value="red">Vermelho</SelectItem>
                            <SelectItem value="yellow">Amarelo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1 justify-between items-center w-full">
                        <h3>Material: </h3>
                        <Select onValueChange={setMaterialFilter} defaultValue="all">
                          <SelectTrigger className="border-black w-[180px] bg-white text-black">
                            <SelectValue placeholder="Filtro de cor" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                            <SelectItem value="plastico">Plástico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1 justify-between items-center w-full">
                        <h3>Tamanho: </h3>
                        <Select onValueChange={setTamanhoFilter} defaultValue="all">
                          <SelectTrigger className="border-black w-[180px] bg-white text-black">
                            <SelectValue placeholder="Filtro de cor" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pequeno">Pequeno</SelectItem>
                            <SelectItem value="medio">Médio</SelectItem>
                            <SelectItem value="grande">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1 justify-start items-center w-full">
                        <h3>Data: </h3>
                        <Popover>
                          <PopoverTrigger asChild className="border-black w-[180px] bg-white text-black">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[180px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {date ? `${`${date.getDate()}`.padStart(2, "0")}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${date.getFullYear()}` : <span>Selecione uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-12 justify-center items-end w-full mx-auto m-10">
                <Card className="rounded-lg text-card-foreground flex flex-col gap-4 w-full max-w-[350px]">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-center text-[24px] text-blue-600">Quantidade Total de Peças</CardTitle>
                    <CardDescription className="text-center text-gray-600"></CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center bg-[#4D648D] min-h-[144px] text-white p-6 text-[32px] font-semibold text-center rounded-lg text-gray-800">
                    <div className="absolute flex justify-left w-full">
                      <Database color="#3b82f6" size={40} className="w-max" />
                    </div>
                    <span className="w-full">{pecas.current.length}</span>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border border-border bg-card text-card-foreground flex flex-col gap-5 w-full max-w-[350px] bg-white border-gray-200">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="te4text-blue-600">Taxa Média Total</CardTitle>
                    <CardDescription className="text-center text-gray-600">Peças por segundo</CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center text-[32px] font-semibold text-center px-6 rounded-lg text-gray-800">
                    <span className="w-full">{averageNew.toFixed(2)}</span>
                  </CardContent>
                </Card>

                {colorFilter === "all" ? (<Card className="rounded-lg border border-border bg-card text-card-foreground flex flex-col gap-5 w-full max-w-[350px] bg-white border-gray-200">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="te4text-blue-600">Cor Predominante</CardTitle>
                    <CardDescription className="text-center text-gray-600">{getMaxQtdPecas()}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center text-[32px] font-semibold text-center px-6 rounded-lg text-gray-800">
                    <span className="w-full">{pecas.current.filter(peca => peca.cor === getMaxQtdPecas() && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</span>
                  </CardContent>
                </Card>) : ""}
              </div>


              <div className="line-1 flex flex-col justify-center gap-8 w-full">
                <div className="flex justify-center gap-6">
                  <Card className="rounded-lg border border-border  text-card-foreground shadow-sm flex flex-col w-full max-w-[350px] bg-[#E0EAF0] p-4 border-gray-200 shadow-sm">
                    <CardHeader className="items-center pb-0">
                      <CardTitle className="text-center text-blue-600">Quantidade de Peças por cor</CardTitle>
                      <CardDescription className="text-center">{date == undefined ? "Todo o tempo" : `${`${date.getDate()}`.padStart(2, "0")}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${date.getFullYear()}`}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData}
                            dataKey="quantidade"
                            nameKey="color"
                            innerRadius={50}
                            strokeWidth={5}
                            activeIndex={indexPecaMax.current}
                            activeShape={({
                              outerRadius = 0,
                              ...props
                            }) => (
                              <Sector {...props} outerRadius={outerRadius + 10} />
                            )}
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 grid-rows-2 gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        <div className="h-4 w-4 bg-red-600 rounded-full"></div> Vermelho
                      </div>
                      <div className="flex items-center gap-2 font-medium leading-none">
                        <div className="h-4 w-4 bg-green-500 rounded-full"></div> Verde
                      </div>
                      <div className="flex items-center gap-2 font-medium leading-none">
                        <div className="h-4 w-4 bg-blue-600 rounded-full"></div> Azul
                      </div>
                      <div className="flex items-center gap-2 font-medium leading-none">
                        <div className="h-4 w-4 bg-yellow-400 rounded-full"></div> Amarelo
                      </div>
                    </CardFooter>
                  </Card>
                  {!date ? (<div className="flex justify-center max-w-[732px] min-w-[732px]">
                    <div className="flex flex-wrap justify-center gap-6 w-full">
                    {colorFilter === "all" || colorFilter === "blue" ? (<Card className="rounded-lg text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#E0EAF0] border-gray-200">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#344BFD] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Azul</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.azul.toFixed(2)}</span>
                        </CardContent>
                      </Card>) : ""}
                  
                      {colorFilter === "all" || colorFilter === "green" ? (<Card className="rounded-lg text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#E0EAF0] border-gray-200">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#2BC84D] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Verde</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.verde.toFixed(2)}</span>
                        </CardContent>
                      </Card>) : ""}
                  
                      {colorFilter === "all" || colorFilter === "red" ? (<Card className="rounded-lg text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#E0EAF0] border-gray-200">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#B10300] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Vermelho</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.vermelho.toFixed(2)}</span>
                        </CardContent>
                      </Card>) : ""}
                  
                      {colorFilter === "all" || colorFilter === "yellow" ? (<Card className="rounded-lg text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#E0EAF0] border-gray-200">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#FFCC00] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Amarelo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.amarelo.toFixed(2)}</span>
                        </CardContent>
                      </Card>) : ""}
                    </div>
                  </div>) : ""}
                </div>

                <div className="flex flex-col gap-4">
                  <Card className="rounded-lg border border-border bg-[#E0EAF0] text-card-foreground shadow-sm p-4 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-blue-600">Últimas 10 Peças</CardTitle>
                      <CardDescription className="text-gray-600">
                        Registro das peças mais recentes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-100">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Cor</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead>Material</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...pecas.current]
                            .sort((a, b) => b.id_prod - a.id_prod)
                            .map((peca) => (
                              <>
                                {colorFilter === "all" ? (
                                  materialFilter == "all" ? (
                                    tamanhoFilter == "all" ? (
                                      <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                        <TableCell className="font-medium">#{peca.id_prod}</TableCell>
                                        <TableCell>{peca.cor}</TableCell>
                                        <TableCell>{peca.tamanho}</TableCell>
                                        <TableCell>{peca.material}{console.log(pecas)}</TableCell>
                                      </TableRow>
                                      ) : tamanhoFilter == "pequeno" ? (
                                      <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                        <TableCell className="font-medium">#{peca.tamanho == 'pequeno' && peca.id_prod}</TableCell>
                                        <TableCell>{peca.tamanho == 'pequeno' && peca.cor}</TableCell>
                                        <TableCell>{peca.tamanho == 'pequeno' && peca.tamanho}</TableCell>
                                        <TableCell>{peca.tamanho == 'pequeno' && peca.material}{console.log(pecas)}</TableCell>
                                      </TableRow>
                                    ) : tamanhoFilter == "medio" ? (
                                      <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                        <TableCell className="font-medium">#{peca.tamanho == 'médio' && peca.id_prod}</TableCell>
                                        <TableCell>{peca.tamanho == 'médio' && peca.cor}</TableCell>
                                        <TableCell>{peca.tamanho == 'médio' && peca.tamanho}</TableCell>
                                        <TableCell>{peca.tamanho == 'médio' && peca.material}{console.log(pecas)}</TableCell>
                                      </TableRow>
                                    ) : tamanhoFilter == "grande" ? (
                                      <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                        <TableCell className="font-medium">#{peca.tamanho == 'grande' && peca.id_prod}</TableCell>
                                        <TableCell>{peca.tamanho == 'grande' && peca.cor}</TableCell>
                                        <TableCell>{peca.tamanho == 'grande' && peca.tamanho}</TableCell>
                                        <TableCell>{peca.tamanho == 'grande' && peca.material}{console.log(pecas)}</TableCell>
                                      </TableRow>
                                    ) : ""
                                  ) : materialFilter == "metal" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.material == 'metal' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.material == 'metal' && peca.cor}</TableCell>
                                    <TableCell>{peca.material == 'metal' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.material == 'metal' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                  ) : materialFilter == "plastico" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.material == 'plástico' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.material == 'plástico' && peca.cor}</TableCell>
                                    <TableCell>{peca.material == 'plástico' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.material == 'plástico' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                  ) : ""
                                ) : colorFilter === "blue" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.cor == 'azul' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.cor == 'azul' && peca.cor}</TableCell>
                                    <TableCell>{peca.cor == 'azul' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.cor == 'azul' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                ) : colorFilter === "green" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.cor == 'verde' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.cor == 'verde' && peca.cor}</TableCell>
                                    <TableCell>{peca.cor == 'verde' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.cor == 'verde' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                ) : colorFilter === "red" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.cor == 'vermelho' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.cor == 'vermelho' && peca.cor}</TableCell>
                                    <TableCell>{peca.cor == 'vermelho' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.cor == 'vermelho' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                ) : colorFilter === "yellow" ? (
                                  <TableRow key={peca.id_prod} className="hover:bg-gray-100">
                                    <TableCell className="font-medium">#{peca.cor == 'amarelo' && peca.id_prod}</TableCell>
                                    <TableCell>{peca.cor == 'amarelo' && peca.cor}</TableCell>
                                    <TableCell>{peca.cor == 'amarelo' && peca.tamanho}</TableCell>
                                    <TableCell>{peca.cor == 'amarelo' && peca.material}{console.log(pecas)}</TableCell>
                                  </TableRow>
                                ) : ""}
                              </>
                          )).slice(0, 10)
                          }
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full">
                {colorFilter === "all" || colorFilter === "blue" ? (<div className="w-full bg-[#E0EAF0] shadow-sm rounded-lg">
                  <div className="text-gray-800 w-full p-4 rounded-lg">
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#344BFD" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(peca => peca.cor === "azul" && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</span>
                    </div>
                      <Table>
                        <TableCaption>Tamanho, quantidade total e por material</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">Tamanho</TableHead>
                            <TableHead className="">Material</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(tamanhoFilter == 'pequeno' && pecas.current.filter(peca => (peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Pequeno</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "azul" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "azul" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'medio' && pecas.current.filter(peca => (peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Médio</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "azul" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "azul" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'grande' && pecas.current.filter(peca => (peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Grande</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "azul" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "azul" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                        </TableBody>
                      </Table>
                  </div>  
                </div>) : ""}
                
                {colorFilter === "all" || colorFilter === "green" ? (<div className="w-full bg-[#E0EAF0] shadow-sm rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#2BC84D" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(peca => peca.cor === "verde" && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</span>
                    </div>
                      <Table>
                        <TableCaption>Tamanho, quantidade total e por material</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">Tamanho</TableHead>
                            <TableHead className="">Material</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(tamanhoFilter == 'pequeno' && pecas.current.filter(peca => (peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Pequeno</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "verde" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "verde" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'medio' && pecas.current.filter(peca => (peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Médio</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "verde" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "verde" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'grande' && pecas.current.filter(peca => (peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Grande</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "verde" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "verde" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                        </TableBody>
                      </Table>
                  </div>
                </div>) : ""}

                {colorFilter === "all" || colorFilter === "red" ? (<div className="w-full bg-[#E0EAF0] shadow-sm rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#B10300" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(peca => peca.cor === "vermelho" && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</span>
                    </div>
                      <Table>
                        <TableCaption>Tamanho, quantidade total e por material</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">Tamanho</TableHead>
                            <TableHead className="">Material</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(tamanhoFilter == 'pequeno' && pecas.current.filter(peca => (peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Pequeno</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "vermelho" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "vermelho" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'medio' && pecas.current.filter(peca => (peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Médio</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "vermelho" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "vermelho" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'grande' && pecas.current.filter(peca => (peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Grande</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "vermelho" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "vermelho" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                        </TableBody>
                      </Table>
                  </div>
                </div>) : ""}

                {colorFilter === "all" || colorFilter === "yellow" ? (<div className="w-full bg-[#E0EAF0] shadow-sm rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#FFCC00" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(peca => peca.cor === "amarelo" && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</span>
                    </div>
                      <Table>
                        <TableCaption>Tamanho, quantidade total e por material</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">Tamanho</TableHead>
                            <TableHead className="">Material</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(tamanhoFilter == 'pequeno' && pecas.current.filter(peca => (peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Pequeno</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "amarelo" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "amarelo" && peca.tamanho === "pequeno") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'medio' && pecas.current.filter(peca => (peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Médio</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "amarelo" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "amarelo" && peca.tamanho === "médio") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                          {(tamanhoFilter == 'grande' && pecas.current.filter(peca => (peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`))) || tamanhoFilter == "all" ? (<TableRow>
                            <TableCell className="font-medium">Grande</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "metal" && peca.cor === "amarelo" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium min-w-14 max-w-14">{pecas.current.filter(peca => (peca.material === "plástico" && peca.cor === "amarelo" && peca.tamanho === "grande") && (!date || `${peca.data_hora}`.split(" ")[0] == `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`)).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>) : ""}
                        </TableBody>
                      </Table>
                  </div>
                </div>) : ""}
              </div>

            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
