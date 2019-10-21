<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medsrec.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../medsrec.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>
	
	<!-- Strings defined for medsrec.xslt, String values defined here override the default values defined in medsrec.xslt -->
	<xsl:variable name="What" as="xs:string">
		<xsl:value-of select="'Qu&#233;'"/>
	</xsl:variable>
	
	<xsl:variable name="HowMuch" as="xs:string">
		<xsl:value-of select="'Cu&#225;nto'"/>
	</xsl:variable>
	
	<xsl:variable name="How" as="xs:string">
		<xsl:value-of select="'C&#243;mo'"/>
	</xsl:variable>
	
	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'Cuando'"/>
	</xsl:variable>
	
	<xsl:variable name="Why" as="xs:string">
		<xsl:value-of select="'Por qu&#233;'"/>
	</xsl:variable>
	
	<xsl:variable name="AsNeeded" as="xs:string">
		<xsl:value-of select="'seg&#250;n necesidad'"/>
	</xsl:variable>
	
	<xsl:variable name="Instructions" as="xs:string">
		<xsl:value-of select="'Instrucciones'"/>
	</xsl:variable>
	
	<xsl:variable name="Duration" as="xs:string">
		<xsl:value-of select="'Duraci&#243;n: '"/>
	</xsl:variable>
	
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Comentarios'"/>
	</xsl:variable>
	
	<xsl:variable name="Pickup" as="xs:string">
		<xsl:value-of select="'Recogida en'"/>
	</xsl:variable>
	
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'Renovaciones:'"/>
	</xsl:variable>
	
	<xsl:variable name="New" as="xs:string">
		<xsl:value-of select="'Nuevo'"/>
	</xsl:variable>
	
	<xsl:variable name="Changed" as="xs:string">
		<xsl:value-of select="'Cambiado'"/>
	</xsl:variable>
	
	<xsl:variable name="Unchanged" as="xs:string">
		<xsl:value-of select="'Sin cambiar'"/>
	</xsl:variable>
	
	<xsl:variable name="NextLastDose" as="xs:string">
		<xsl:value-of select="'Siguiente dosis'"/>
	</xsl:variable>
	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Dejar de tomar'"/>
	</xsl:variable>
	
	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'P&#243;ngase en contacto con el m&#233;dico que realiz&#243; la prescripci&#243;n si le surgen preguntas'"/>
	</xsl:variable>
	
	<xsl:variable name="Connector" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	
	<xsl:variable name="PharmacyConnector" as="xs:string">
		<xsl:value-of select="'%s: %s %s'"/>
	</xsl:variable>

	<!-- Displays Frequency followed by PRN. -->
	<!-- Swap placeholders to display PRN followed by Frequency -->
	<xsl:variable name="FreqPRNConnector" as="xs:string">
		<xsl:value-of select="'%1$s seg&#250;n necesidad durante %2$s'"/>
	</xsl:variable>
	
	<!-- Used to display either of PRN Reason or PRN Instructions -->
	<xsl:variable name="PRNConnector" as="xs:string">
		<xsl:value-of select="'seg&#250;n necesidad durante %1$s'"/>
	</xsl:variable>

	<xsl:variable name="SeeInstructions" as="xs:string">
		<xsl:value-of select="'Ver instrucciones'"/>
	</xsl:variable>
	
	<xsl:variable name="Printed" as="xs:string">
		<xsl:value-of select="'Prescripción impresa'"/>
	</xsl:variable>
	
</xsl:stylesheet>
