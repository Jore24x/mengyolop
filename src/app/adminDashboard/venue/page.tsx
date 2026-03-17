"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Edit2, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export default function VenuePage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State baru untuk fitur Manage & Edit
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i < 10 ? `0${i}:00` : `${i}:00`);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venue");
      const data = await res.json();
      setVenues(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk membuka modal pilihan (Pop-up)
  const handleManageClick = (venue: any) => {
    setSelectedVenue(venue);
    setIsActionModalOpen(true);
  };

  // Handler untuk masuk ke mode Edit
  const handleOpenEditDrawer = () => {
    setIsEditMode(true);
    setIsActionModalOpen(false);
    setIsDrawerOpen(true);
  };

  // Handler untuk menambah venue baru (Reset state edit)
  const handleOpenAddDrawer = () => {
    setIsEditMode(false);
    setSelectedVenue(null);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Jika edit mode, kita mungkin butuh ID venue untuk dikirim ke API
    if (isEditMode && selectedVenue) {
      formData.append("id", selectedVenue.id);
    }

    try {
      const res = await fetch("/api/venue", {
        method: isEditMode ? "PUT" : "POST", // Menggunakan PUT jika edit
        body: formData,
      });

      if (res.ok) {
        const updatedVenues = await res.json();
        setVenues(updatedVenues);
        setIsDrawerOpen(false);
        setIsEditMode(false);
        setSelectedVenue(null);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex p-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Venue List</h1>
        
        {/* Tombol Add Venue Sekarang Memanggil Fungsi Reset */}
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleOpenAddDrawer}>
          <Plus className="mr-2 h-4 w-4" /> Add Venue
        </Button>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
          <DrawerContent>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <DrawerHeader>
                <DrawerTitle>{isEditMode ? "Edit Venue" : "Add New Venue"}</DrawerTitle>
                <DrawerDescription>
                  {isEditMode ? "Make changes to your venue information below." : "Upload an image and fill venue details."}
                </DrawerDescription>
              </DrawerHeader>
              <Separator />

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Field>
                  <FieldLabel>Venue Name <span className="text-red-500">*</span></FieldLabel>
                  <Input 
                    name="venueName" 
                    defaultValue={selectedVenue?.name || ""} 
                    placeholder="Enter venue name" 
                    required 
                  />
                </Field>

                <Field>
                  <FieldLabel>Phone Number <span className="text-red-500">*</span></FieldLabel>
                  <Input 
                    name="phone" 
                    type="tel" 
                    defaultValue={selectedVenue?.phone || ""} 
                    placeholder="0812..." 
                    required 
                  />
                </Field>

                <Field>
                  <FieldLabel>Address <span className="text-red-500">*</span></FieldLabel>
                  <Textarea 
                    name="address" 
                    defaultValue={selectedVenue?.address || ""} 
                    placeholder="Full address" 
                    required 
                  />
                </Field>

                <Field>
                  <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
                  <Input 
                    name="city" 
                    defaultValue={selectedVenue?.city || ""} 
                    placeholder="City name" 
                    required 
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Opening Hour</FieldLabel>
                    <Select name="openingHour" defaultValue={selectedVenue?.openingHour} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => <SelectItem key={`open-${h}`} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Closing Hour</FieldLabel>
                    <Select name="closingHour" defaultValue={selectedVenue?.closingHour} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => <SelectItem key={`close-${h}`} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="picture">Image {!isEditMode && <span className="text-red-500">*</span>}</FieldLabel>
                  <FieldDescription>
                    {isEditMode ? "Leave empty to keep current image" : "Select 1 image for the card cover"}
                  </FieldDescription>
                  <Input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    required={!isEditMode}
                  />
                </Field>
              </div>

              <Separator />
              <DrawerFooter>
                <Button type="submit" className="w-full bg-blue-600" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (isEditMode ? "Update Venue" : "Save Venue")}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Main Content: Carousel */}
      <div className="p-10">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : venues.length === 0 ? (
          <div className="text-center text-muted-foreground">No Venue Found</div>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full px-12">
            <CarouselContent className="-ml-4">
              {venues.map((venue) => (
                <CarouselItem key={venue.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden shadow-lg border ">
                    <div className="aspect-video relative">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{venue.name}</CardTitle>
                      <CardDescription>{venue.city} • {venue.openingHour}-{venue.closingHour}</CardDescription>
                    </CardHeader>
                    
                    <CardFooter>
                      <Button className="w-full bg-blue-600" onClick={() => handleManageClick(venue)}>
                        Manage Venue
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>

      {/* Pop-up Dialog Pilihan: Edit Venue vs Manage Court */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedVenue?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col h-32 gap-3 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all" 
              onClick={handleOpenEditDrawer}
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <Edit2 className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-semibold">Edit Venue</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col h-32 gap-3 border-2 hover:border-green-500 hover:bg-green-50 transition-all"
              onClick={() => {
                // Navigasi ke halaman manage court atau panggil fungsi lain
                console.log("Manage court for ID:", selectedVenue?.id);
                setIsActionModalOpen(false);
              }}
            >
              <div className="p-3 bg-green-100 rounded-full">
                <LayoutDashboard className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-semibold">Manage Court</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}