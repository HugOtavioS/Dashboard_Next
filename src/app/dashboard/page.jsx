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

export default function Dashboard() {
  
  const pecas = useRef([]);
  const [averageNew, setAverageNew] = useState(0);
  const taxa = useRef(0);
  const indexPecaMax = useRef(0);

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
    Azul: 0,
    Verde: 0,
    Vermelho: 0,
    Amarelo: 0,
  });
  const cumulativeNewColorRef = useRef({
    Azul: 0,
    Verde: 0,
    Vermelho: 0,
    Amarelo: 0,
  });
  const callsCountColorRef = useRef({
    Azul: 0,
    Verde: 0,
    Vermelho: 0,
    Amarelo: 0,
  });
  const [averageNewColor, setAverageNewColor] = useState({
    Azul: 0,
    Verde: 0,
    Vermelho: 0,
    Amarelo: 0,
  });

  useEffect(() => {
    taxa.current = 1;
  }, []);

  // Função para adicionar um contato (dados de exemplo)
  const addPeca = async () => {
    try {
      const newContact = {
        id_Cor: Math.floor(Math.random() * 4) + 1,
        id_Tamanho: Math.floor(Math.random() * 3) + 1,
        id_Material: Math.floor(Math.random() * 2) + 1,
        Data_hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      const response = await axios.post("http://localhost:8080?addpeca", newContact, {
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
        Azul: data.filter(c => c.Cor === "Azul").length,
        Verde: data.filter(c => c.Cor === "Verde").length,
        Vermelho: data.filter(c => c.Cor === "Vermelho").length,
        Amarelo: data.filter(c => c.Cor === "Amarelo").length,
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
    const colors = ["Azul", "Verde", "Vermelho", "Amarelo"];
    const newAverages = {};

    colors.forEach((cor) => {
      const currentCount = pecasList.filter(c => c.Cor === cor).length;
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
    const colors = ["Azul", "Verde", "Vermelho", "Amarelo"];
    let maxColor = null;
    let maxCount = -1;
    let maxIndex = -1;

    colors.forEach((color, idx) => {
      const count = pecas.current.filter(contact => contact.Cor === color).length;
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
    setChartData([
      { color: "Azul", quantidade: pecas.current.filter(contact => contact.Cor === "Azul").length, fill: "#344BFD" },
      { color: "Verde", quantidade: pecas.current.filter(contact => contact.Cor === "Verde").length, fill: "#2BC84D" },
      { color: "Vermelho", quantidade: pecas.current.filter(contact => contact.Cor === "Vermelho").length, fill: "#B10300" },
      { color: "Amarelo", quantidade: pecas.current.filter(contact => contact.Cor === "Amarelo").length, fill: "#FFCC00" },
    ]);
  };

  // Intervalo para adicionar um contato a cada 0.5 segundos
  useEffect(() => {
    firstGetPecas();
    getPecas();
    
    const addInterval = setInterval(() => {
      getMaxQtdPecas()
      getPecas();  
      addPeca();
      updateChartData();
    }, `${taxa.current * 1000}`);

    return () => clearInterval(addInterval);
  }, []);
  
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

              <div className="flex gap-12 justify-center w-full mx-auto">
                <Card className="rounded-lg border border-border text-card-foreground shadow-sm flex flex-col gap-4 w-full max-w-[350px] border-gray-200 shadow-sm">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-center text-[24px] text-blue-600">Quantidade Total de Peças</CardTitle>
                    <CardDescription className="text-center text-gray-600"></CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center bg-[#4D648D] text-white p-6 text-[32px] font-semibold text-center rounded-lg text-gray-800">
                    <div className="absolute flex justify-left w-full">
                      <Database color="#3b82f6" size={40} className="w-max" />
                    </div>
                    <span className="w-full">{pecas.current.length}</span>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 grid-rows-2 gap-2 text-sm">
                  </CardFooter>
                </Card>

                <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm flex flex-col gap-5 w-full max-w-[350px] bg-white border-gray-200 shadow-sm">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="te4text-blue-600">Taxa Média</CardTitle>
                    <CardDescription className="text-center text-gray-600">Peças por segundo</CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center text-[32px] font-semibold text-center px-6 rounded-lg text-gray-800">
                    <span className="w-full">{averageNew.toFixed(2)}</span>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm flex flex-col gap-5 w-full max-w-[350px] bg-white border-gray-200 shadow-sm">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="te4text-blue-600">Cor Predominante</CardTitle>
                    <CardDescription className="text-center text-gray-600">{getMaxQtdPecas()}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center text-[32px] font-semibold text-center px-6 rounded-lg text-gray-800">
                    <span className="w-full">{pecas.current.filter(c => c.Cor === getMaxQtdPecas()).length}</span>
                  </CardContent>
                </Card>
              </div>


              <div className="line-1 flex flex-col justify-center gap-8 w-full">
                <div className="flex justify-between gap-6">
                  <Card className="rounded-lg border border-border  text-card-foreground shadow-sm flex flex-col w-full max-w-[350px] bg-[#B6CCD8] p-4 border-gray-200 shadow-sm">
                    <CardHeader className="items-center pb-0">
                      <CardTitle className="text-center text-blue-600">Quantidade de Peças por cor</CardTitle>
                      <CardDescription className="text-center text-gray-500">January - June 2024</CardDescription>
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
                  <div className="flex justify-center max-w-[732px] min-w-[732px]">
                    <div className="flex flex-wrap justify-center gap-6 w-full">
                      <Card className="rounded-lg border border-border text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#B6CCD8] border-gray-200 shadow-sm">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#344BFD] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Azul</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.Azul.toFixed(2)}</span>
                        </CardContent>
                      </Card>
                  
                      <Card className="rounded-lg border border-border text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#B6CCD8] border-gray-200 shadow-sm">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#2BC84D] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Verde</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.Verde.toFixed(2)}</span>
                        </CardContent>
                      </Card>
                  
                      <Card className="rounded-lg border border-border text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#B6CCD8] border-gray-200 shadow-sm">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#B10300] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Vermelho</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.Vermelho.toFixed(2)}</span>
                        </CardContent>
                      </Card>
                  
                      <Card className="rounded-lg border border-border text-card-foreground shadow-sm relative flex flex-col items-center w-[350px] h-[200px] bg-[#B6CCD8] border-gray-200 shadow-sm">
                        <div className="absolute top-0 left-0 w-1/8 h-full bg-[#FFCC00] rounded-s-lg"></div>
                        <CardHeader className="items-center w-3/5">
                          <CardTitle className="text-center text-gray-800">Peças por Segundo <hr className="border-gray-300 my-1"></hr> Amarelo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex w-full h-full pb-0 p-0">
                          <span className="m-auto text-[36px] text-gray-800">{averageNewColor.Amarelo.toFixed(2)}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Card className="rounded-lg border border-border bg-[#B6CCD8] text-card-foreground shadow-sm shadow-sm p-4 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-blue-600">Últimas Peças</CardTitle>
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
                          {pecas.current.slice(-5).reverse().map((peca) => (
                            <TableRow key={peca.id} className="hover:bg-gray-100">
                              <TableCell className="font-medium">#{peca.id}</TableCell>
                              <TableCell>{peca.Cor}</TableCell>
                              <TableCell>{peca.Tamanho}</TableCell>
                              <TableCell>{peca.Material}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 w-full">
                <div className="w-full bg-white border-gray-200 rounded-lg shadow-sm">
                  <div className="border border-gray-200 bg-[#B6CCD8] text-gray-800 shadow-sm w-full p-4 rounded-lg">
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#344BFD" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(contact => contact.Cor === "Azul").length}</span>
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
                          <TableRow>
                            <TableCell className="font-medium">P</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Azul" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Azul" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">M</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Azul" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Azul" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">G</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Azul" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Azul" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>  
                </div>
                
                <div className="w-full bg-[#B6CCD8] rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#2BC84D" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(contact => contact.Cor === "Verde").length}</span>
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
                          <TableRow>
                            <TableCell className="font-medium">P</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Verde" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Verde" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">M</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Verde" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Verde" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">G</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Verde" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Verde" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>
                </div>

                <div className="w-full bg-[#B6CCD8] rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#B10300" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(contact => contact.Cor === "Vermelho").length}</span>
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
                          <TableRow>
                            <TableCell className="font-medium">P</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">M</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">G</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Vermelho" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>
                </div>

                <div className="w-full bg-[#B6CCD8] rounded-lg">
                  {/* <div className="w-full h-[48px] bg-[#B10300] rounded-t-xl"></div> */}
                  <div className="w-full p-4 rounded-lg">
                    {/* <h1 className="text-center text-[24px] font-semibold py-4">Vermelho</h1> */}
                    <div className="flex justify-center items-center gap-2 py-4 w-max mx-auto">
                      <Database color="#FFCC00" size={40} className="" />
                      <span className="text-[20px]">{pecas.current.filter(contact => contact.Cor === "Amarelo").length}</span>
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
                          <TableRow>
                            <TableCell className="font-medium">P</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "P")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">M</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "M")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">G</TableCell>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Aço</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Plástico</TableCell>
                                  <TableCell className="font-medium">{pecas.current.filter(contact => (contact.Material === "Não Metalico" && contact.Cor === "Amarelo" && contact.Tamanho === "G")).length}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
