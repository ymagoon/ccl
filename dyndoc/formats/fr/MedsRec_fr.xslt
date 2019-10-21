<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medsrec.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../medsrec.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'fr'"/>
	
	<!-- Strings defined for medsrec.xslt, String values defined here override the default values defined in medsrec.xslt -->
	<xsl:variable name="What" as="xs:string">
		<xsl:value-of select="'Quoi'"/>
	</xsl:variable>
	
	<xsl:variable name="HowMuch" as="xs:string">
		<xsl:value-of select="'Combien'"/>
	</xsl:variable>
	
	<xsl:variable name="How" as="xs:string">
		<xsl:value-of select="'Comment'"/>
	</xsl:variable>
	
	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'Quand'"/>
	</xsl:variable>
	
	<xsl:variable name="Why" as="xs:string">
		<xsl:value-of select="'Pourquoi'"/>
	</xsl:variable>
	
	<xsl:variable name="AsNeeded" as="xs:string">
		<xsl:value-of select="'au besoin'"/>
	</xsl:variable>
	
	<xsl:variable name="Instructions" as="xs:string">
		<xsl:value-of select="'Instructions'"/>
	</xsl:variable>
	
	<xsl:variable name="Duration" as="xs:string">
		<xsl:value-of select="'Dur&#233;e&#160;:'"/>
	</xsl:variable>
	
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Commentaires'"/>
	</xsl:variable>
	
	<xsl:variable name="Pickup" as="xs:string">
		<xsl:value-of select="'Collecter &#224;'"/>
	</xsl:variable>
	
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'R&#233;approvisionnements&#160;:'"/>
	</xsl:variable>
	
	<xsl:variable name="New" as="xs:string">
		<xsl:value-of select="'Nouveau'"/>
	</xsl:variable>
	
	<xsl:variable name="Changed" as="xs:string">
		<xsl:value-of select="'Modifi&#233;'"/>
	</xsl:variable>
	
	<xsl:variable name="Unchanged" as="xs:string">
		<xsl:value-of select="'Non modifi&#233;'"/>
	</xsl:variable>
	
	<xsl:variable name="NextLastDose" as="xs:string">
		<xsl:value-of select="'Prochaine dose'"/>
	</xsl:variable>
	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Arr&#234;t de la prise'"/>
	</xsl:variable>
	
	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'Contactez le m&#233;decin prescripteur pour toute question ou inqui&#233;tude.'"/>
	</xsl:variable>
	
	<xsl:variable name="Connector" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	
	<xsl:variable name="PharmacyConnector" as="xs:string">
		<xsl:value-of select="'%s&#160;: %s %s'"/>
	</xsl:variable>

	<!-- Displays Frequency followed by PRN. -->
	<!-- Swap placeholders to display PRN followed by Frequency -->
	<xsl:variable name="FreqPRNConnector" as="xs:string">
		<xsl:value-of select="'%1$s au besoin pour %2$s'"/>
	</xsl:variable>
	
	<!-- Used to display either of PRN Reason or PRN Instructions -->
	<xsl:variable name="PRNConnector" as="xs:string">
		<xsl:value-of select="'au besoin pour %1$s'"/>
	</xsl:variable>

	<xsl:variable name="SeeInstructions" as="xs:string">
		<xsl:value-of select="'Consultez les instructions'"/>
	</xsl:variable>
	
	<xsl:variable name="Printed" as="xs:string">
		<xsl:value-of select="'Prescriptions de sortie imprimées'"/>
	</xsl:variable>
	
</xsl:stylesheet>
