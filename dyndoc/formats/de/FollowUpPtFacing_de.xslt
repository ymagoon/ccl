<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/followupptfacing.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../followupptfacing.xslt" /> -->
        <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
	<!-- Comment this line to debug-->  <xsl:include href="/cernerbasiccontent/formats/de/addressfxn_de.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../addressfxn_de.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<!-- Strings defined for followup.xslt, String values defined here override the default values defined in followupptfacing.xslt -->
	<xsl:variable name="With" as="xs:string">
		<xsl:value-of select="'Mit'"/>
	</xsl:variable>
	
	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'Wenn'"/>
	</xsl:variable>
	
	<xsl:variable name="Day" as="xs:string">
		<xsl:value-of select="'Tag'"/>
	</xsl:variable>
	
	<xsl:variable name="Days" as="xs:string">
		<xsl:value-of select="'Tagen'"/>
	</xsl:variable>
	
	<xsl:variable name="Week" as="xs:string">
		<xsl:value-of select="'Woche'"/>
	</xsl:variable>
	
	<xsl:variable name="Weeks" as="xs:string">
		<xsl:value-of select="'Wochen'"/>
	</xsl:variable>
	
	<xsl:variable name="Month" as="xs:string">
		<xsl:value-of select="'Monat'"/>
	</xsl:variable>
	
	<xsl:variable name="Months" as="xs:string">
		<xsl:value-of select="'Monaten'"/>
	</xsl:variable>
	
	<xsl:variable name="Year" as="xs:string">
		<xsl:value-of select="'Jahr'"/>
	</xsl:variable>
	
	<xsl:variable name="Years" as="xs:string">
		<xsl:value-of select="'Jahren'"/>
	</xsl:variable>
	
	<xsl:variable name="Within" as="xs:string">
		<xsl:value-of select="'innerhalb'"/>
	</xsl:variable>
	
	<!-- For example, "'%1$s %2$s'" will output Within 1 to 2 days while "'%2$s %1$s'" will output 1 to 2 days Within -->
	<xsl:variable name="WithinSomeTimeFormatter" as="xs:string">
		<xsl:value-of select="'%1$s %2$s'"/>
	</xsl:variable>
	
	<xsl:variable name="In" as="xs:string">
		<xsl:value-of select="'in'"/>
	</xsl:variable>
	
	<!-- For example, "'%1$s %2$s %3$s '" will output In 5 days while "'%2$s %1$s %3$s '" will output 5 In days -->
	<xsl:variable name="InSomeTimeFormatter" as="xs:string">
		<xsl:value-of select="'%1$s %2$s %3$s '"/>
	</xsl:variable>
	
	<xsl:variable name="OnlyIfNeededBeginning" as="xs:string">
		<xsl:value-of select="'Nur bei Bedarf'"/> <!-- Used in the beginning of a sentence or phrase -->
	</xsl:variable>
	
	<xsl:variable name="OnlyIfNeededNotBeginning" as="xs:string">
		<xsl:value-of select="', Nur bei Bedarf'"/> <!-- Used in the middle of a sentence or phrase -->
	</xsl:variable>
	
	<xsl:variable name="Contact" as="xs:string">
		<xsl:value-of select="'Kontaktinformationen'"/>
	</xsl:variable>
	
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Weitere Anweisungen'"/>
	</xsl:variable>
	
	<xsl:variable name="NoFollowup" as="xs:string">
		<xsl:value-of select="''"/>
	</xsl:variable>
	
</xsl:stylesheet>
