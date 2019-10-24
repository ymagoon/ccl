<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	exclude-result-prefixes="xsl xs fn n">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/demonamecontactgenderdob.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../demonamecontactgenderdob.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/nl/dateformat_nl.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_nl.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>
	
	<!-- Strings defined for demonamecontactgenderdob.xslt, String values defined here override the default values defined in demonamecontactgenderdob.xslt -->
	<xsl:variable name="Name" as="xs:string">
		<xsl:value-of select="'Naam:'"/>
	</xsl:variable>
	
	<xsl:variable name="Address" as="xs:string">
		<xsl:value-of select="'Adres:'"/>
	</xsl:variable>
	
	<xsl:variable name="Sex" as="xs:string">
		<xsl:value-of select="'Geslacht:'"/>
	</xsl:variable>
	
	<xsl:variable name="DOB" as="xs:string">
		<xsl:value-of select="'Geboortedatum:'"/>
	</xsl:variable>
	
	<xsl:variable name="Phone" as="xs:string">
		<xsl:value-of select="'Telefoonnummer:'"/>
	</xsl:variable>
	
	<xsl:variable name="EmergencyContact" as="xs:string">
		<xsl:value-of select="'Noodcontact:'"/>
	</xsl:variable>
	
	<!-- This is the i18n version of demographics address since different locales can have different address formats. This template overrides the one defined in demonamecontactgenderdob.xslt -->
	<xsl:template name="DisplayAddress">
		<xsl:param name="Address"/>
				
		<xsl:variable name="Address1" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address1">
					<xsl:value-of select="$Address/@address1"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address2" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address2">
					<xsl:value-of select="$Address/@address2"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address3" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address3">
					<xsl:value-of select="$Address/@address3"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address4" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address4">
					<xsl:value-of select="$Address/@address4"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="City" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@city">
					<xsl:value-of select="$Address/@city"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="State" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@state">
					<xsl:value-of select="$Address/@state"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="Zip" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@zip">
					<xsl:value-of select="$Address/@zip"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:if test="$Address1!=''"> 
			<xsl:value-of select="$Address1"/>
		</xsl:if>
		
		<xsl:if test="$Address2!=''"> 
			<xsl:if test="$Address1!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address2"/>
		</xsl:if>
		
		<xsl:if test="$Address3!=''"> 
			<xsl:if test="$Address1!='' or $Address2!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address3"/>
		</xsl:if>
		
		<xsl:if test="$Address4!=''"> 
			<xsl:if test="$Address1!='' or $Address2!='' or $Address3!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address4"/>
		</xsl:if>
		
		<xsl:if test="$City!='' or $State!='' or $Zip!=''">
			<br />
			
			<xsl:if test="$City!=''"> 
				<xsl:value-of select="$City"/>
			</xsl:if>
			<xsl:if test="$State!=''">
				<xsl:if test="$City!=''">
					<xsl:value-of select="', '"/>
				</xsl:if>
				<xsl:value-of select="$State"/>
			</xsl:if>
			<xsl:if test="$Zip!=''">
				<xsl:if test="$City!='' or $State!=''">
					<xsl:value-of select="' '"/>
				</xsl:if>
				<xsl:value-of select="$Zip"/>
			</xsl:if>
			
		</xsl:if>
				
	</xsl:template>
	
</xsl:stylesheet>
