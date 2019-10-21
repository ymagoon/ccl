<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/familyhistory.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../familyhistory.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<!-- Strings defined for familyhistory.xslt, String values defined here override the default values defined in familyhistory.xslt -->
	<xsl:variable name="PatientAdopted" as="xs:string">
		<xsl:value-of select="'Patient wurde adoptiert'"/>
	</xsl:variable>
	
	<xsl:variable name="UnableToObtain" as="xs:string">
		<xsl:value-of select="'Familienanamnese kann nicht erhoben werden'"/>
	</xsl:variable>
	
	<xsl:variable name="HistoryNegative" as="xs:string">
		<xsl:value-of select="'Familienanamnese ist negativ'"/>
	</xsl:variable>
	
	<xsl:variable name="HistoryUnknown" as="xs:string">
		<xsl:value-of select="'Familienanamnese ist unbekannt'"/>
	</xsl:variable>
	
	<xsl:variable name="DiagnosedDisplay" as="xs:string">
		<xsl:value-of select="' (Diagnose %s)'"/>
	</xsl:variable>
	
	<xsl:variable name="DiagnosedAtDisplay" as="xs:string">
		<xsl:value-of select="' (Diagnostiziert in %s)'"/>
	</xsl:variable>
	
	<xsl:variable name="ConditionPersonListSeparator" as="xs:string">
		<xsl:value-of select="'%s: '"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyListOnlyOne" as="xs:string">
		<xsl:value-of select="'%s.'"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyListSeparator" as="xs:string">
		<xsl:value-of select="', %s'"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyListEnd" as="xs:string">
		<xsl:value-of select="' und %s.'"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyMemberDisp" as="xs:string">
		<xsl:value-of select="'%s%s'"/>
	</xsl:variable>
	
	<xsl:variable name="NegConditionDisplay" as="xs:string">
		<xsl:value-of select="'Negativ: '"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyMemberNegative" as="xs:string">
		<xsl:value-of select="'%s: Historie ist negativ'"/>
	</xsl:variable>
	
	<xsl:variable name="FamilyMemberUnkn" as="xs:string">
		<xsl:value-of select="'%s: Historie ist unbekannt'"/>
	</xsl:variable>
	
	<!-- Strings from the histories control, NOTE: These MUST match the displays from code set 25320 -->
	<xsl:variable name="HistCtrlAbout" as="xs:string" select="'Circa'"/>
	<xsl:variable name="HistCtrlBefore" as="xs:string" select="'Vor'"/>
	<xsl:variable name="HistCtrlAfter" as="xs:string" select="'Nach'"/>
	<xsl:variable name="HistCtrlUnknown" as="xs:string" select="'Unbekannt'"/>
</xsl:stylesheet>
