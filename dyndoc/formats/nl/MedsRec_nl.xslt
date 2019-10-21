<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medsrec.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../medsrec.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>
	
	<!-- Strings defined for medsrec.xslt, String values defined here override the default values defined in medsrec.xslt -->
	<xsl:variable name="What" as="xs:string">
		<xsl:value-of select="'Wat'"/>
	</xsl:variable>
	
	<xsl:variable name="HowMuch" as="xs:string">
		<xsl:value-of select="'Hoeveel'"/>
	</xsl:variable>
	
	<xsl:variable name="How" as="xs:string">
		<xsl:value-of select="'Hoe'"/>
	</xsl:variable>
	
	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'Wanneer'"/>
	</xsl:variable>
	
	<xsl:variable name="Why" as="xs:string">
		<xsl:value-of select="'Waarom'"/>
	</xsl:variable>
	
	<xsl:variable name="AsNeeded" as="xs:string">
		<xsl:value-of select="'Indien nodig'"/>
	</xsl:variable>
	
	<xsl:variable name="Instructions" as="xs:string">
		<xsl:value-of select="'Instructies'"/>
	</xsl:variable>
	
	<xsl:variable name="Duration" as="xs:string">
		<xsl:value-of select="'Duur: '"/>
	</xsl:variable>
	
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Opmerkingen'"/>
	</xsl:variable>
	
	<xsl:variable name="Pickup" as="xs:string">
		<xsl:value-of select="'Ophalen op'"/>
	</xsl:variable>
	
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'Herhaalrecepten:'"/>
	</xsl:variable>
	
	<xsl:variable name="New" as="xs:string">
		<xsl:value-of select="'Nieuw'"/>
	</xsl:variable>
	
	<xsl:variable name="Changed" as="xs:string">
		<xsl:value-of select="'Gewijzigd'"/>
	</xsl:variable>
	
	<xsl:variable name="Unchanged" as="xs:string">
		<xsl:value-of select="'Ongewijzigd'"/>
	</xsl:variable>
	
	<xsl:variable name="NextLastDose" as="xs:string">
		<xsl:value-of select="'Volgende dosis'"/>
	</xsl:variable>
	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Gebruik stoppen'"/>
	</xsl:variable>
	
	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'Neem contact op met voorschrijvend arts indien u vragen of twijfels heeft'"/>
	</xsl:variable>
	
	<xsl:variable name="Connector" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	
	<!-- Displays Frequency followed by PRN. -->
	<!-- Swap placeholders to display PRN followed by Frequency -->
	<xsl:variable name="FreqPRNConnector" as="xs:string">
		<xsl:value-of select="'%1$s indien nodig voor %2$s'"/>
	</xsl:variable>
	
	<!-- Used to display either of PRN Reason or PRN Instructions -->
	<xsl:variable name="PRNConnector" as="xs:string">
		<xsl:value-of select="'indien nodig voor %1$s'"/>
	</xsl:variable>

	<xsl:variable name="SeeInstructions" as="xs:string">
		<xsl:value-of select="'Zie instructies'"/>
	</xsl:variable>
	
	<xsl:variable name="Printed" as="xs:string">
		<xsl:value-of select="'Afgedrukt recept'"/>
	</xsl:variable>
	
</xsl:stylesheet>
