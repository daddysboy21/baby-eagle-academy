import { useState } from "react";
import { applicationsAPI } from '@/services/api';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const partnerSchema = z.object({
  fullNameCompany: z.string().min(2, "Name/Company must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  partnershipInterest: z.string().min(1, "Please select partnership interest"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const PartnerApplicationForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      fullNameCompany: "",
      email: "",
      phone: "",
      partnershipInterest: "",
    }
  });

  const onSubmit = async (data: PartnerFormData) => {
    try {
      await applicationsAPI.submitPartner(data);
      toast({
        title: "Partnership Application Submitted!",
        description: "Thank you for your interest in partnering with us. We'll be in touch soon!",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="h-14 text-lg font-semibold flex items-center gap-2">
          <Handshake className="w-5 h-5" />
          Partner With Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partnership Application Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullNameCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name / Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name or company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partnershipInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partnership Interest</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your partnership interest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      <SelectItem value="scholarship">Scholarship Support</SelectItem>
                      <SelectItem value="kit-branding">Kit Branding</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerApplicationForm;